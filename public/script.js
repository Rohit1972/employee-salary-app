document.addEventListener("DOMContentLoaded", () => {
    fetchEmployees();
    populateEmployeeDropdown();
});

async function fetchEmployees() {
    const response = await fetch('/employees');
    const employees = await response.json();
    const employeeList = document.getElementById('employee-list');
    employeeList.innerHTML = '';

    employees.forEach(employee => {
        const employeeDiv = document.createElement('div');
        employeeDiv.className = 'employee';
        employeeDiv.innerHTML = `
            <span>${employee.name} - ${employee.position} - ${employee.department} -$${employee.salary}</span>
            <div>
                <button onclick="editEmployee('${employee._id}', '${employee.name}', '${employee.position}','${employee.department}', '${employee.salary}')">Edit</button>
                <button onclick="deleteEmployee('${employee._id}')">Delete</button>
            </div>
        `;
        employeeList.appendChild(employeeDiv);
    });
    populateEmployeeDropdown(employees);
}

async function addEmployee() {
    const name = document.getElementById('name').value;
    const position = document.getElementById('position').value;
    const department=document.getElementById('department').value;
    const salary = document.getElementById('salary').value;

    if (name && position && salary) {
        const response = await fetch('/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, position,department, salary })
        });

        if (response.ok) {
            fetchEmployees();
            document.getElementById('name').value = '';
            document.getElementById('position').value = '';
            document.getElementById('department').value='';
            document.getElementById('salary').value = '';
        }
    } else {
        alert('Please fill out all fields');
    }
}

async function deleteEmployee(id) {
    const response = await fetch(`/employees/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        fetchEmployees();
    }
}

function editEmployee(id, name, position, salary) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-position').value = position;
    document.getElementById('edit-department').value=department;
    document.getElementById('edit-salary').value = salary;
    document.getElementById('edit-container').style.display = 'block';
}

async function updateEmployee() {
    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('edit-name').value;
    const position = document.getElementById('edit-position').value;
    const department=document.getElementById('edit-department').value;
    const salary = document.getElementById('edit-salary').value;

    if (name && position && department &&salary) {
        const response = await fetch(`/employees/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, position,department, salary })
        });

        if (response.ok) {
            fetchEmployees();
            cancelEdit();
        }
    } else {
        alert('Please fill out all fields');
    }
}

function cancelEdit() {
    document.getElementById('edit-id').value = '';
    document.getElementById('edit-name').value = '';
    document.getElementById('edit-position').value = '';
    document.getElementById('edit-department').value='';
    document.getElementById('edit-salary').value = '';
    document.getElementById('edit-container').style.display = 'none';
}

function populateEmployeeDropdown(employees) {
    const employeeSelect = document.getElementById('employee-select');
    employeeSelect.innerHTML = '<option value="">Select Employee</option>';

    employees.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee._id;
        option.text = employee.name;
        employeeSelect.appendChild(option);
    });
}

async function calculateSalary() {
    const employeeId = document.getElementById('employee-select').value;
    const hoursWorked = document.getElementById('hours-worked').value;
    const hourlyRate = document.getElementById('hourly-rate').value;

    if (employeeId && hoursWorked && hourlyRate) {
        const totalSalary = hoursWorked * hourlyRate;
        document.getElementById('calculated-salary').innerText = `Calculated Salary: $${totalSalary}`;
    } else {
        alert('Please select an employee and fill out all fields');
    }
}

async function calculateTotalSalary() {
    const response = await fetch('/employees');
    const employees = await response.json();

    const totalSalary = employees.reduce((acc, employee) => acc + Number(employee.salary), 0);
    document.getElementById('total-salary').innerText = `Total Salary of All Employees: $${totalSalary}`;
}
