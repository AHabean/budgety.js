
document.querySelector('.delete').addEventListener('click', changeDeleteBtn);

function changeDeleteBtn() {
    document.getElementById('deleteIcon').classList.add('animatedIcon');
    document.getElementById('animBtn').classList.add('animatedDelBtn');
    window.setTimeout(function() {
        document.getElementById('deleteIcon').classList.remove('animatedIcon');
        document.getElementById('animBtn').classList.remove('animatedDelBtn');
    }, 4000);
    
};





