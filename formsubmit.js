const scriptURL = 'https://script.google.com/macros/s/AKfycbxqzNF8mQbsCu5Fd878dJnXA5uYO_I-hWlMoi6etm0dV0GjRi3fqnd4F6NUFNZO0HCh/exec'
const form = document.forms['google-sheet']

form.addEventListener('submit', e => {
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => $("#form_alerts").html("<div class='alert alert-success'>I thawn fel tawh e.</div>"))
    .catch(error => $("#form_alerts").html("<div class='alert alert-danger'>Dik lo a awm.</div>"))
 })