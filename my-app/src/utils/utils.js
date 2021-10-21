export const findLongestWorkingColleagues = (employees) => {
    return employees.reduce((accum, employee) => {
        employees.forEach(colleague => {
            if (colleague.employeeId !== employee.employeeId && colleague.projectId === employee.projectId) {
                if (
                    employee.fromDate.getTime() <= colleague.toDate.getTime() &&
                    colleague.fromDate.getTime() <= employee.toDate.getTime()
                ) {
                    const smallerFromDate = Math.min(employee.fromDate.getTime(), colleague.fromDate.getTime());
                    const biggerToDate = Math.max(employee.toDate.getTime(), colleague.toDate.getTime());
                    const startDatesDiff = Math.abs(employee.fromDate.getTime() - colleague.fromDate.getTime());
                    const toDatesDiff = Math.abs(employee.toDate.getTime() - colleague.toDate.getTime());
                    const time = biggerToDate - smallerFromDate - startDatesDiff - toDatesDiff;
 
                    if (time > accum.time) {
                        accum = {
                            firstColleagueId: employee.employeeId,
                            secondColleagueId: colleague.employeeId,
                            time
                        };
                    }
                }
            }
        });
 
        return accum;
    }, {
        firstColleagueId: null,
        secondColleagueId: null,
        time: null
    });
};
