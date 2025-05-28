function includeHTML(callback) {
    const elements = document.querySelectorAll('[data-include]');
    let loaded = 0;
    if (elements.length === 0 && callback) callback();
    elements.forEach(el => {
        const file = el.getAttribute('data-include');
        fetch(file)
            .then(resp => resp.text())
            .then(data => {
                el.innerHTML = data;
                loaded++;
                if (loaded === elements.length && callback) callback();
            });
    });
}

window.addEventListener('DOMContentLoaded', () => {
    includeHTML(() => {
        // Carga app.js después de los includes
        const script = document.createElement('script');
        script.src = '/js/app.js';
        document.body.appendChild(script);
    });
});