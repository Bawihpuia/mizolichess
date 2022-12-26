const authorizeEndpoint = "https://lichess.org/oauth";
const tokenEndpoint = "https://lichess.org/api/token";
    const clientId = "mizo-lichess";

    if (window.location.search) {
        var args = new URLSearchParams(window.location.search);
        var code = args.get("code");

        if (code) {
            var xhr = new XMLHttpRequest();

            xhr.onload = function() {
                var response = xhr.response;
                var message;

                if (xhr.status == 200) {
                    message = "" + response.access_token;
                }
                else {
                    message = "Error: " + response.error_description + " (" + response.error + ")";
                }

                document.getElementById("token").value = message;
                
            };
            xhr.responseType = 'json';
            xhr.open("POST", tokenEndpoint, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.send(new URLSearchParams({
                client_id: clientId,
                code_verifier: window.sessionStorage.getItem("code_verifier"),
                grant_type: "authorization_code",
                redirect_uri: location.href.replace(location.search, ''),
                code: code
            }));
        }
    }

    document.getElementById("startButton").onclick = function() {
        var codeVerifier = generateRandomString(64);

        generateCodeChallenge(codeVerifier).then(function(codeChallenge) {
            window.sessionStorage.setItem("code_verifier", codeVerifier);

            var redirectUri = window.location.href.split('?')[0];
            var args = new URLSearchParams({
                response_type: "code",
                client_id: clientId,
                code_challenge_method: "S256",
                scope: "challenge:write tournament:write team:write",
                code_challenge: codeChallenge,
                redirect_uri: redirectUri
            });
            window.location = authorizeEndpoint + "/?" + args;
        });
    }

    async function generateCodeChallenge(codeVerifier) {
        var digest = await crypto.subtle.digest("SHA-256",
            new TextEncoder().encode(codeVerifier));

        return btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    }

    function generateRandomString(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }
    
