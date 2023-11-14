//localStorage.clear();
var list = document.getElementById('myUL');
//localStorage.clear();

window.addEventListener('load', function() {
    loadTasks();
});

// toggiel dla taska
list.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked');
        saveTasks(); 
    }
});

//edycja taska

list.addEventListener('click', function(event) {
    
    if (event.target.tagName === 'LI') {
        
        if (!event.target.classList.contains('editing')) {
            
            makeEditable(event.target);
        }
    } else {
        
        saveTasks();
    }
});



function newElement() {
    var li = document.createElement("li");
    var inputValue = document.getElementById("myInput").value;
    var dateValue = document.getElementById("myDate").value;

   
    if (inputValue.length < 3 || inputValue.length > 255) {
        alert("od 3 do 255 znakow!");
        return;
    }

   
    if (dateValue !== "" && new Date(dateValue) <= new Date()) {
        alert("Data musi byc pusta, albo wskazywac na przyszlosc!");
        return;
    }

    var taskText = document.createTextNode(inputValue + " (Do: " + formatDate(dateValue) + ")");
    li.appendChild(taskText);

    if (inputValue === '') {
        alert("Pole nie moze byc puste");
    } else {
        list.appendChild(li);
        saveTasks(); 

  
    document.getElementById("myInput").value = "";
    document.getElementById("myDate").value = "";
    document.getElementById("searchInput").value = "";

    
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);

    filterList();
}

list.addEventListener('click', function(event) {
    if (event.target.classList.contains('close')) {
        var div = event.target.parentElement;
        div.style.display = "none";
        saveTasks(); 
    }
});



function saveTasks() {
    var tasks = [];
    var taskElements = list.getElementsByTagName('li');
    
    for (var i = 0; i < taskElements.length; i++) {
        tasks.push(taskElements[i].innerText);
    }

    localStorage.setItem('tasks', JSON.stringify(tasks)); //serializacja 
}


function loadTasks() {
    var storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        var tasks = JSON.parse(storedTasks); //deserializacja?

        for (var i = 0; i < tasks.length; i++) {
            var li = document.createElement("li");
            li.innerHTML = tasks[i];
            list.appendChild(li);
        }
    }
}

function formatDate(dateString) {
    var options = { year: 'numeric', month: 'long', day: 'numeric'};
    var formattedDate = new Date(dateString).toLocaleDateString('pl-PL', options);
    return formattedDate;
}


function filterList() {
    var input, filter, ul, li, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");

    for (var i = 0; i < li.length; i++) {
        txtValue = li[i].textContent || li[i].innerText;

        if (txtValue.toUpperCase().indexOf(filter) > -1) {
           
            li[i].style.display = "";

            
            var highlightedText = txtValue.replace(new RegExp(filter, 'gi'), function(match) {
                return '<span class="highlight">' + match + '</span>';
            });

            li[i].innerHTML = highlightedText;
        } else {
           
            li[i].style.display = "none";
        }
    }
}

function makeEditable(li) {
    
    li.classList.remove('checked');

    
    li.innerHTML = li.textContent;

    
    var input = document.createElement('input');
    input.type = 'text';
    input.value = li.textContent;

   
    li.classList.add('editing');

 
    li.innerHTML = '';
    li.appendChild(input);

  
    input.focus();

    
    input.addEventListener('blur', function() {
        
        li.innerHTML = input.value + '<span class="close">\u00D7</span>';
        li.classList.remove('editing');
        saveTasks(); 
    });
}}
