export const findLongestWorkingColleagues = (employees) => {
    return employees.reduce((accum, employee) => {
        employees.forEach(colleague => {
            if (colleague.employeeID !== employee.employeeID && colleague.projectID === employee.projectID) {
                if (
                    employee.fromDate.getTime() <= colleague.toDate.getTime() &&
                    colleague.fromDate.getTime() <= employee.toDate.getTime()
                ){
                    const smallerFromDate = Math.min(employee.fromDate.getTime(), colleague.fromDate.getTime());
                    const biggerToDate = Math.max(employee.toDate.getTime(), colleague.toDate.getTime());
                    const startDatesDiff = Math.abs(employee.fromDate.getTime() - colleague.fromDate.getTime());
                    const toDatesDiff = Math.abs(employee.toDate.getTime() - colleague.toDate.getTime());
                    const time = biggerToDate - smallerFromDate - startDatesDiff - toDatesDiff;


                    if (time > accum.time) {
                        accum = {
                            firstColleagueID: employee.employeeID,
                            secondColleagueID: colleague.employeeID,
                            time
                        };
                    }
                }
            }
        });

        return accum;
    }, {
        firstColleagueID: null,
        secondColleagueID: null,
        time: null
    });
};