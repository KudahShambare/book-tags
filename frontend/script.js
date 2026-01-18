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
pTag.innerHTML = `
<div>
  <span>${name} || ${className}</span>
  <button onclick="this.parentElement.remove()">Remove</button>
</div>
`;

  list.appendChild(pTag)
  document.getElementById('name').value = null;
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
    .then((response) => {
        if (response.ok) {
            setTimeout(() => {
                window.location.href = '/download';
            }, 2000);   
        }
        throw new Error('Failed to generate PDF');
    }
    )
  
    .catch((error) => {
        console.error('Error:', error);
    });

    // Clear the array and the list
    students = [];
    list.innerHTML = '';
});


