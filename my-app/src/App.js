import { useCallback, useState } from 'react';
import { findLongestWorkingColleagues } from './utils';

import './App.css';

const formatDate = date => {
  const year = `0${date.getFullYear()}`.slice(-2);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);

  return `${year}-${month}-${day}`;
};

function App() {
  const [data, setData] = useState([]);
  const { firstColleagueId, secondColleagueId } = findLongestWorkingColleagues(data);
  const onChange = useCallback(event => {
    const { files, value: filePath } = event.target;

    if (!filePath.endsWith('.txt')) {
      return;
    }

    const reader = new FileReader();

    reader.onload = event => {
      const { result } = event.target;
      const formattedData = result
        .split('\n')
        .map(item => {
          const [employeeId, projectId, fromDate, toDate] = item.trim().split(/,\s*/);

          return {
            employeeId,
            projectId,
            fromDate: new Date(fromDate),
            toDate: toDate === 'NULL' ? new Date() : new Date(toDate)
          };
        });

      setData(formattedData);
    }
    reader.readAsText(files[0]);
  }, []);

  return (
    <div className="app">
      <input type="file" onChange={onChange} />
      {!data.length ? null :
        <div className="body">
          <div className="table">
            <div className="header">
              <div className="column">Employee ID</div>
              <div className="column">Project ID</div>
              <div className="column">From Date</div>
              <div className="column">To Date</div>
            </div>
            <div className="content">
              {data.map((employee, index) =>
                <div key={index} className="row">
                  <div className="column">{employee.employeeId}</div>
                  <div className="column">{employee.projectId}</div>
                  <div className="column">{formatDate(employee.fromDate)}</div>
                  <div className="column">{formatDate(employee.toDate)}</div>
                </div>
              )}
            </div>
          </div>
          {!firstColleagueId || !secondColleagueId ? null :
            <div className="additional-info">The longest working together employees are {firstColleagueId} and {secondColleagueId}</div>
          }
        </div>
      }
    </div>
  );
}

export default App;
