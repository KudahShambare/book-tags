const addStudent = document.getElementById('add');
const list = document.getElementById('list');
const generate = document.getElementById('generate');

let students = [];
//Events

addStudent.addEventListener('click', (e) => {
    e.preventDefault();
    let pTag = document.createElement('p');
    const name = document.getElementById('name').value;
    const className = document.getElementById('class').value;
students.push({name, className});
pTag.innerHTML = `${name} || ${className}`;
  list.appendChild(pTag)
    })


generate.addEventListener('click', (e) => {
    e.preventDefault();

    const dataToSend = { students }; // Wrap the array in an object

    // Send the data to the server
    fetch('/file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
    })
    .then((response) => response.blob())
    .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'students.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    // Clear the array and the list
    students = [];
    list.innerHTML = '';
});


