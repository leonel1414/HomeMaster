const headerMenu=document.querySelector('.hm-header');

console.log(headerMenu.offsetTop);

window.addEventListener('scroll',()=>{
    if(window.pageYOffset > 80){
        headerMenu.classList.add('header-fixed');
    }else{
        headerMenu.classList.remove('header-fixed');
    }
})

/*=========================================
    Tabs
==========================================*/
if (document.querySelector('.hm-tabs')) {
    const tabLinks = document.querySelectorAll('.hm-tab-link');
    const tabContainers = document.querySelectorAll('.grid-product');

    tabLinks.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            
            // Desactivar todos
            tabLinks.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            tabContainers.forEach(container => {
                container.style.display = 'none';
            });

            const targetContainer = document.getElementById(`tab-${target}`);
            if (targetContainer) {
                targetContainer.style.display = 'grid';
            }
        });
    });

    // Activar primer tab por defecto
    if (tabLinks.length > 0) {
        tabLinks[0].click(); // Simula un clic inicial
    }
}

/*=========================================
    MENU
==========================================*/

const menu=document.querySelector('.icon-menu');
const menuClose=document.querySelector('.cerrar-menu');

menu.addEventListener('click',()=>{
    document.querySelector('.header-menu-movil').classList.add('active');
})

menuClose.addEventListener('click',()=>{
    document.querySelector('.header-menu-movil').classList.remove('active');
})