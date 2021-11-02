import React, { useState } from 'react';
import { max, min, differenceInDays } from 'date-fns';
import FilePicker from './File/File';
import Table from './Table/Table';
import './index.css';

const App = () => {
  const [employees, setEmployees] = useState([]);

  const onGetFileContent = (content) => {
    const employees = content
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => {
        const [employeeId, projectId, dateFrom, dateTo] = line.split(',');
        return {
          employeeId: employeeId.trim(),
          projectId: projectId.trim(),
          dateFrom: new Date(dateFrom.trim()),
          dateTo: dateTo.trim() === 'NULL' ? new Date() : new Date(dateTo.trim()),
          isToday: dateTo.trim() === 'NULL'
        }
      });

    const pairsOfEmployeesSortedInDescOrderByDaysWorkedTogether = employees
      .reduce((accumulator, employee) => {
        const { projectId, ...restEmployee } = employee;
        const isProjectAdded = accumulator.some(({ projectId }) => projectId === employee.projectId);

        return isProjectAdded
          ? accumulator.map((project) => ({
            ...project,
            employees: project.projectId === employee.projectId
              ? [...project.employees, restEmployee]
              : project.employees
          }))
          : [...accumulator, {
            projectId: employee.projectId,
            employees: [restEmployee]
          }];
      }, [])
      .map((project) => ({
        ...project,
        employees: project.employees
          .map((employee) => {
            const otherEmployees = project.employees.filter(({ employeeId }) => (
              employeeId !== employee.employeeId
            ));

            return {
              employeeId: employee.employeeId,
              daysWorked: otherEmployees
                .map((otherEmployee) => {
                  const start = max([
                    employee.dateFrom,
                    otherEmployee.dateFrom
                  ]);

                  const end = employee.isToday || otherEmployee.isToday
                    ? new Date()
                    : min([
                      employee.dateTo,
                      otherEmployee.dateTo
                    ]);

                  return {
                    employeeId: otherEmployee.employeeId,
                    daysWorked: differenceInDays(end, start)
                  };
                })
                .sort((a, b) => (
                  b.daysWorked - a.daysWorked
                ))
                .filter((otherEmployee) => (
                  otherEmployee.daysWorked >= 0
                ))
            }
          })
          .filter((employee) => (
            employee.daysWorked.length > 0
          ))
      }))
      .filter((project) => project.employees.length > 0)
      .map((project) => ({
        ...project,
        employees: project.employees
          .map((employee) => {
            const [firstDaysWorked] = employee.daysWorked;

            return {
              employeeId: employee.employeeId,
              otherEmployeeId: firstDaysWorked.employeeId,
              daysWorked: firstDaysWorked.daysWorked
            };
          })
          .reduce((accumulator, employee) => (
            accumulator.some(({ employeeId, otherEmployeeId }) => (
              (employeeId === employee.employeeId && otherEmployeeId === employee.otherEmployeeId)
                || (otherEmployeeId === employee.employeeId && employeeId === employee.otherEmployeeId)
            ))
            ? accumulator
            : [...accumulator, employee]
          ), [])
          .sort((a, b) => b.daysWorked - a.daysWorked)
      }))
      .reduce((accumulator, project) => (
        [...accumulator, ...project.employees.map((employee) => ({
          ...employee,
          projectId: project.projectId
        }))]
      ), [])
      .sort((a, b) => b.daysWorked - a.daysWorked);

    setEmployees(pairsOfEmployeesSortedInDescOrderByDaysWorkedTogether);

    console.log('Results:');
    console.log(pairsOfEmployeesSortedInDescOrderByDaysWorkedTogether);
  };

  const onDropFiles = ([file]) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      onGetFileContent(fileReader.result);
    }

    fileReader.readAsText(file);
  };

  return (
    <div className="app">
      <div className="app__content">
        <div className="app__title">
          <h2>Employees Task</h2>
          <span>For Sirma Solutions</span>
        </div>

        <FilePicker
          accept="text/plain"
          onDrop={onDropFiles}
        />

        {employees.length > 0 && (
          <div className="app__employees">
            <Table
              items={employees}
              columns={[{
                name: 'employeeId',
                label: 'Employee ID #1',
                render: ({ employeeId }) => (
                  <span>{employeeId}</span>
                )
              }, {
                name: 'otherEmployeeId',
                label: 'Employee ID #2',
                render: ({ otherEmployeeId }) => (
                  <span>{otherEmployeeId}</span>
                )
              }, {
                name: 'projectId',
                label: 'Project ID',
                render: ({ projectId }) => (
                  <span>{projectId}</span>
                )
              }, {
                name: 'daysWorked',
                label: 'Days worked',
                render: ({ daysWorked }) => (
                  <span>{daysWorked}</span>
                )
              }]}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;