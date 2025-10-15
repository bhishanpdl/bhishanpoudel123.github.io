document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("calculate").addEventListener("click", function(e) {
        e.preventDefault();
        calculateSingleRecovery();
    });

    // Job type selector
    const jobTypeBtns = document.querySelectorAll('.job-type-btn');
    jobTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            
            // Update active button
            jobTypeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide job sections
            document.getElementById('permanent-job-section').classList.toggle('active', type === 'permanent');
            document.getElementById('contract-job-section').classList.toggle('active', type === 'contract');
        });
    });

    // Show holidays button
    document.getElementById("show-holidays").addEventListener("click", function() {
        const holidaysList = document.getElementById("holidays-list");
        holidaysList.classList.toggle('active');
        
        if (holidaysList.classList.contains('active')) {
            displayFederalHolidays();
        }
    });
});

// Function to display federal holidays
function displayFederalHolidays() {
    const currentYear = new Date().getFullYear();
    const holidays = getFederalHolidays(currentYear);
    
    let html = '<ul>';
    holidays.forEach(holiday => {
        html += `<li><strong>${holiday.name}:</strong> ${holiday.date}</li>`;
    });
    html += '</ul>';
    
    document.getElementById("holidays-dates").innerHTML = html;
}

// Function to get federal holidays for a given year
function getFederalHolidays(year) {
    const holidays = [
        { name: "New Year's Day", date: `${year}-01-01` },
        { name: "Martin Luther King Jr. Day", date: getMLKDay(year) },
        { name: "Presidents' Day", date: getPresidentsDay(year) },
        { name: "Memorial Day", date: getMemorialDay(year) },
        { name: "Juneteenth", date: `${year}-06-19` },
        { name: "Independence Day", date: `${year}-07-04` },
        { name: "Labor Day", date: getLaborDay(year) },
        { name: "Columbus Day", date: getColumbusDay(year) },
        { name: "Veterans Day", date: `${year}-11-11` },
        { name: "Thanksgiving Day", date: getThanksgiving(year) },
        { name: "Christmas Day", date: `${year}-12-25` }
    ];
    
    return holidays;
}

// Helper functions for floating holidays
function getMLKDay(year) {
    // Third Monday of January
    return getNthWeekdayOfMonth(year, 0, 1, 3);
}

function getPresidentsDay(year) {
    // Third Monday of February
    return getNthWeekdayOfMonth(year, 1, 1, 3);
}

function getMemorialDay(year) {
    // Last Monday of May
    return getLastWeekdayOfMonth(year, 4, 1);
}

function getLaborDay(year) {
    // First Monday of September
    return getNthWeekdayOfMonth(year, 8, 1, 1);
}

function getColumbusDay(year) {
    // Second Monday of October
    return getNthWeekdayOfMonth(year, 9, 1, 2);
}

function getThanksgiving(year) {
    // Fourth Thursday of November
    return getNthWeekdayOfMonth(year, 10, 4, 4);
}

function getNthWeekdayOfMonth(year, month, weekday, n) {
    // weekday: 0=Sunday, 1=Monday, ..., 6=Saturday
    const firstDay = new Date(year, month, 1);
    const firstWeekday = (weekday - firstDay.getDay() + 7) % 7;
    const date = new Date(year, month, 1 + firstWeekday + (n - 1) * 7);
    return date.toISOString().split('T')[0];
}

function getLastWeekdayOfMonth(year, month, weekday) {
    const lastDay = new Date(year, month + 1, 0);
    const lastWeekday = lastDay.getDate() - (lastDay.getDay() - weekday + 7) % 7;
    const date = new Date(year, month, lastWeekday);
    return date.toISOString().split('T')[0];
}

// Calculate contract yearly equivalent salary
function calculateContractYearlyEquivalent(hourlyRate, hoursPerWeek, contractStartDate, contractEndDate, unpaidDays, unpaidHolidays) {
    // Calculate contract duration in days
    const contractDays = daysBetween(contractStartDate, contractEndDate) + 1;
    const contractWeeks = contractDays / 7;
    
    // Calculate total contract earnings
    const totalContractEarnings = hourlyRate * hoursPerWeek * contractWeeks;
    
    // Calculate daily rate during contract
    const contractDailyRate = totalContractEarnings / contractDays;
    
    // Extrapolate to yearly equivalent (accounting for unpaid days)
    const totalWorkingDays = 365 - unpaidDays - unpaidHolidays;
    const yearlyEquivalent = contractDailyRate * totalWorkingDays;
    
    return {
        yearlyEquivalent: Math.round(yearlyEquivalent),
        totalContractEarnings: Math.round(totalContractEarnings),
        contractDays,
        contractWeeks: Math.round(contractWeeks * 10) / 10,
        contractDailyRate: Math.round(contractDailyRate * 100) / 100,
        totalWorkingDays,
        unpaidDays,
        unpaidHolidays
    };
}

// Calculate adjusted old job salary (accounting for benefits)
function calculateAdjustedOldSalary(baseSalary, paidDays, paidHolidays) {
    // Old job has paid time off, so no adjustment needed for comparison
    // We use the base salary since paid days are already included
    const totalPaidDays = 365; // All days are effectively paid in permanent role
    const dailyRate = baseSalary / totalPaidDays;
    
    return {
        adjustedSalary: baseSalary,
        dailyRate: Math.round(dailyRate * 100) / 100,
        totalPaidDays,
        paidDays,
        paidHolidays
    };
}

// Exact day calculation matching Python
function daysBetween(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    // Convert to UTC to avoid timezone issues
    const utc1 = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const utc2 = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

// Improved YMD conversion to match Python exactly
function convertDaysToYMD(days) {
    const start = new Date(2000, 0, 1); // Base date
    const end = new Date(start);
    end.setDate(start.getDate() + days);

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let daysDiff = end.getDate() - start.getDate();

    // Handle negative days
    if (daysDiff < 0) {
        months -= 1;
        // Get last day of previous month
        const lastDay = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
        daysDiff += lastDay;
    }

    // Handle negative months
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return `${years}y ${months}m ${daysDiff}d`;
}

function calculateRecoveryTime(lostEarnings, newSalary, lastSalary, joinDate, oldAnnualIncrease, newAnnualIncrease) {
    let cumulativeDifference = 0;
    let daysCount = 0;
    let currentDate = new Date(joinDate);
    let currentOldSalary = lastSalary;
    let currentNewSalary = newSalary;

    const maxDays = 3650; // 10 years safety limit

    while (cumulativeDifference < lostEarnings && daysCount < maxDays) {
        // Calculate daily earnings with exact decimal matching Python
        const dailyOldSalary = currentOldSalary / 365;
        const dailyNewSalary = currentNewSalary / 365;
        const dailyDifference = dailyNewSalary - dailyOldSalary;

        // Use exact decimal arithmetic like Python
        cumulativeDifference = parseFloat((cumulativeDifference + dailyDifference).toFixed(2));
        daysCount++;

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);

        // Check for October 1st salary increases (month is 0-based in JS)
        if (currentDate.getMonth() === 9 && currentDate.getDate() === 1) {
            currentOldSalary = parseFloat((currentOldSalary * (1 + oldAnnualIncrease / 100)).toFixed(2));
            currentNewSalary = parseFloat((currentNewSalary * (1 + newAnnualIncrease / 100)).toFixed(2));
        }
    }

    // Calculate final values with same rounding as Python
    const dailyOld = currentOldSalary / 365;
    const dailyNew = currentNewSalary / 365;
    const cumOld = parseFloat((dailyOld * daysCount).toFixed(2));
    const cumNew = parseFloat((dailyNew * daysCount).toFixed(2));
    const totalAmount = Math.round(cumNew - cumOld);

    return {
        daysCount,
        totalAmount,
        dailyOld,
        dailyNew,
        cumOld,
        cumNew,
        breakevenDate: currentDate
    };
}

function formatBreakevenInfo(recoveryInfo, leaveDate, joinDate, jobType = 'permanent', contractDetails = null) {
    const today = new Date();
    const breakevenDate = recoveryInfo.breakevenDate;

    // Calculate time differences matching Python's relativedelta
    function getTimeDiff(start, end) {
        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        let days = end.getDate() - start.getDate();

        if (days < 0) {
            months -= 1;
            // Get days in previous month
            const prevMonthLastDay = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
            days += prevMonthLastDay;
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        return `${years}y ${months}m ${days}d`;
    }

    const fromLeave = getTimeDiff(new Date(leaveDate), breakevenDate);
    const fromJoin = getTimeDiff(new Date(joinDate), breakevenDate);
    const fromToday = getTimeDiff(today, breakevenDate);

    const jobTypeLabel = jobType === 'contract' ? 'Contract Job' : 'New Job';

    let contractInfo = '';
    if (jobType === 'contract' && contractDetails) {
        contractInfo = `
            <div class="contract-details">
                <h5>Contract Details</h5>
                <p><strong>Contract Duration:</strong> ${contractDetails.contractDays} days (${contractDetails.contractWeeks} weeks)</p>
                <p><strong>Total Contract Value:</strong> $${contractDetails.totalContractEarnings.toLocaleString()}</p>
                <p><strong>Contract Daily Rate:</strong> $${contractDetails.contractDailyRate.toFixed(2)}</p>
            </div>
        `;
    }

    return `
        <div class="breakeven-details">
            <h4>📅 Breakeven Date Analysis</h4>
            <p><strong>Status:</strong> ${recoveryInfo.totalAmount >= 0 ? 'Breakeven Reached' : 'Closest Calculation'}</p>
            <p><strong>Date:</strong> ${breakevenDate.toISOString().split('T')[0]}</p>
            <p><strong>Cumulative Old Job Earnings:</strong> $${parseFloat(recoveryInfo.cumOld).toLocaleString()}</p>
            <p><strong>Cumulative ${jobTypeLabel} Earnings:</strong> $${parseFloat(recoveryInfo.cumNew).toLocaleString()}</p>
            <p><strong>Gap (New - Old):</strong> $${recoveryInfo.totalAmount.toLocaleString()}</p>

            <div class="salary-details">
                <div>
                    <h5>Old Job</h5>
                    <p>Daily: $${recoveryInfo.dailyOld.toFixed(2)}</p>
                    <p>Annual: $${Math.round(recoveryInfo.dailyOld * 365).toLocaleString()}</p>
                </div>
                <div>
                    <h5>${jobTypeLabel}</h5>
                    <p>Daily: $${recoveryInfo.dailyNew.toFixed(2)}</p>
                    <p>Annual: $${Math.round(recoveryInfo.dailyNew * 365).toLocaleString()}</p>
                </div>
            </div>

            ${contractInfo}

            <div class="time-details">
                <p><strong>Time from leave date:</strong> ${fromLeave}</p>
                <p><strong>Time from join date:</strong> ${fromJoin}</p>
                <p><strong>Time from today:</strong> ${fromToday}</p>
            </div>
        </div>
    `;
}

// ... (keep all previous functions until calculateSingleRecovery function)

function calculateSingleRecovery() {
    try {
        // Get input values
        const leaveDate = document.getElementById("leave-date").value;
        const joinDate = document.getElementById("join-date").value;
        const lastSalary = parseFloat(document.getElementById("last-salary").value) || 0;
        const jobType = document.querySelector('.job-type-btn.active').getAttribute('data-type');
        
        // Old job benefits
        const oldPaidDays = parseFloat(document.getElementById("old-paid-days").value) || 0;
        const oldPaidHolidays = parseFloat(document.getElementById("old-paid-holidays").value) || 0;
        const oldAnnualIncrease = parseFloat(document.getElementById("old-annual-increase").value) || 0;
        
        let newSalary, newAnnualIncrease;
        let contractDetails = null;
        let oldJobDetails = null;

        // Calculate adjusted old job salary (accounting for benefits)
        oldJobDetails = calculateAdjustedOldSalary(lastSalary, oldPaidDays, oldPaidHolidays);

        if (jobType === 'permanent') {
            newSalary = parseFloat(document.getElementById("new-salary").value) || 0;
            newAnnualIncrease = parseFloat(document.getElementById("new-annual-increase").value) || 0;
        } else {
            // Contract job calculation
            const hourlyRate = parseFloat(document.getElementById("hourly-rate").value) || 0;
            const hoursPerWeek = parseFloat(document.getElementById("hours-per-week").value) || 40;
            const contractStartDate = document.getElementById("contract-start-date").value;
            const contractEndDate = document.getElementById("contract-end-date").value;
            const contractUnpaidDays = parseFloat(document.getElementById("contract-unpaid-days").value) || 0;
            const contractUnpaidHolidays = parseFloat(document.getElementById("contract-unpaid-holidays").value) || 0;
            
            contractDetails = calculateContractYearlyEquivalent(
                hourlyRate, 
                hoursPerWeek, 
                contractStartDate, 
                contractEndDate,
                contractUnpaidDays,
                contractUnpaidHolidays
            );
            newSalary = contractDetails.yearlyEquivalent;
            newAnnualIncrease = 0; // Contract jobs typically don't have annual increases
        }

        // Validation
        if (isNaN(new Date(leaveDate).getTime()) || isNaN(new Date(joinDate).getTime())) {
            throw new Error("Invalid dates provided");
        }
        if (lastSalary <= 0 || newSalary <= 0) {
            throw new Error("Salaries must be positive numbers");
        }
        if (new Date(leaveDate) >= new Date(joinDate)) {
            throw new Error("Join date must be after leave date");
        }
        if (jobType === 'contract') {
            const contractStartDate = document.getElementById("contract-start-date").value;
            const contractEndDate = document.getElementById("contract-end-date").value;
            if (new Date(contractStartDate) >= new Date(contractEndDate)) {
                throw new Error("Contract end date must be after start date");
            }
        }

        // Calculate basic values with exact matching to Python
        const unemploymentDays = daysBetween(leaveDate, joinDate);
        const dailyLastSalary = oldJobDetails.dailyRate;
        const lostEarnings = Math.round(dailyLastSalary * unemploymentDays);

        // Calculate recovery time with exact Python matching
        const recovery = calculateRecoveryTime(
            lostEarnings,
            newSalary,
            lastSalary, // Using base salary for old job
            joinDate,
            oldAnnualIncrease,
            newAnnualIncrease
        );

        const coverTime = convertDaysToYMD(recovery.daysCount);
        const breakevenInfo = formatBreakevenInfo(recovery, leaveDate, joinDate, jobType, contractDetails);

        // Calculate 10-year income projection
        const incomeProjection = calculateIncomeProjection(
            leaveDate,
            joinDate,
            lastSalary,
            newSalary,
            oldAnnualIncrease,
            newAnnualIncrease,
            jobType
        );

        // Display results
        let resultHTML = `
            <div class="summary">
                <h2>📊 Job Loss Recovery Analysis</h2>

                <div class="section unemployment-section">
                    <h3>📉 Unemployment Period</h3>
                    <p><strong>Duration:</strong> ${convertDaysToYMD(unemploymentDays)} (${unemploymentDays} days)</p>
                    <p><strong>Lost Earnings:</strong> $${lostEarnings.toLocaleString()}</p>
                    <p><strong>Daily Loss:</strong> $${dailyLastSalary.toFixed(2)}</p>
                </div>

                <div class="comparison">
                    <div class="job-box old-job">
                        <h3>🔴 Previous Job</h3>
                        <p><strong>Base Salary:</strong> $${lastSalary.toLocaleString()}/year</p>
                        <p><strong>Daily Rate:</strong> $${dailyLastSalary.toFixed(2)}</p>
                        <p><strong>Paid Days Off:</strong> ${oldPaidDays} days</p>
                        <p><strong>Paid Holidays:</strong> ${oldPaidHolidays} days</p>
                        <p><strong>Annual Increase:</strong> ${oldAnnualIncrease}%</p>
                    </div>
        `;

        if (jobType === 'permanent') {
            resultHTML += `
                    <div class="job-box new-job">
                        <h3>🟢 New Permanent Job</h3>
                        <p><strong>Salary:</strong> $${newSalary.toLocaleString()}/year</p>
                        <p><strong>Daily Rate:</strong> $${(newSalary / 365).toFixed(2)}</p>
                        <p><strong>Daily Advantage:</strong> $${((newSalary / 365) - dailyLastSalary).toFixed(2)}</p>
                        <p><strong>Annual Increase:</strong> ${newAnnualIncrease}%</p>
                    </div>
            `;
        } else {
            resultHTML += `
                    <div class="job-box contract-job">
                        <h3>🟣 Contract Job</h3>
                        <p><strong>Hourly Rate:</strong> $${parseFloat(document.getElementById("hourly-rate").value).toFixed(2)}</p>
                        <p><strong>Hours/Week:</strong> ${document.getElementById("hours-per-week").value}</p>
                        <p><strong>Contract Duration:</strong> ${contractDetails.contractDays} days</p>
                        <p><strong>Total Contract Value:</strong> $${contractDetails.totalContractEarnings.toLocaleString()}</p>
                        <p><strong>Yearly Equivalent:</strong> $${newSalary.toLocaleString()}</p>
                        <p><strong>Daily Rate:</strong> $${(newSalary / 365).toFixed(2)}</p>
                        <p><strong>Daily Advantage:</strong> $${((newSalary / 365) - dailyLastSalary).toFixed(2)}</p>
                        <p><strong>Unpaid Days:</strong> ${contractDetails.unpaidDays}</p>
                        <p><strong>Unpaid Holidays:</strong> ${contractDetails.unpaidHolidays}</p>
                    </div>
            `;
        }

        resultHTML += `
                </div>

                <div class="recovery-section">
                    <h3>🎯 Recovery Timeline</h3>
                    <p><strong>Time to Break Even:</strong> ${coverTime}</p>
                    <p><strong>Total Recovery Amount:</strong> $${recovery.totalAmount.toLocaleString()}</p>
                    ${breakevenInfo}
                </div>

                ${incomeProjection}
            </div>
        `;

        document.getElementById("result").innerHTML = resultHTML;

    } catch (error) {
        document.getElementById("result").innerHTML = `
            <div class="error-message">
                <strong>Error:</strong> ${error.message}
            </div>
        `;
    }
}

// New function to calculate 10-year income projection
function calculateIncomeProjection(leaveDate, joinDate, lastSalary, newSalary, oldAnnualIncrease, newAnnualIncrease, jobType) {
    const leave = new Date(leaveDate);
    const join = new Date(joinDate);
    const currentYear = leave.getFullYear();
    
    let projectionHTML = `
        <div class="section income-projection-section">
            <h3>📈 10-Year Income Projection</h3>
            <p><strong>Comparison from leave date (${leaveDate}) to new job start (${joinDate})</strong></p>
            
            <table class="income-table">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Old Job Income</th>
                        <th>New Job Income</th>
                        <th>Difference</th>
                        <th>Cumulative Difference</th>
                    </tr>
                </thead>
                <tbody>
    `;

    let cumulativeDifference = 0;
    let currentOldSalary = lastSalary;
    let currentNewSalary = newSalary;
    
    // Calculate unemployment period earnings
    const unemploymentDays = daysBetween(leaveDate, joinDate);
    const unemploymentOldEarnings = (currentOldSalary / 365) * unemploymentDays;
    const unemploymentNewEarnings = 0; // No earnings during unemployment
    
    projectionHTML += `
        <tr class="year-header">
            <td><strong>Unemployment Period</strong><br>${leaveDate} to ${joinDate}<br>(${unemploymentDays} days)</td>
            <td>$${Math.round(unemploymentOldEarnings).toLocaleString()}</td>
            <td>$${Math.round(unemploymentNewEarnings).toLocaleString()}</td>
            <td class="negative">-$${Math.round(unemploymentOldEarnings).toLocaleString()}</td>
            <td class="negative">-$${Math.round(unemploymentOldEarnings).toLocaleString()}</td>
        </tr>
    `;
    
    cumulativeDifference -= unemploymentOldEarnings;

    // Calculate 10 years of projections starting from the year after joining
    for (let yearOffset = 0; yearOffset < 10; yearOffset++) {
        const year = join.getFullYear() + yearOffset;
        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year, 11, 31);
        
        // Calculate days worked in this year
        let daysWorkedOld = 0;
        let daysWorkedNew = 0;
        
        if (year === join.getFullYear()) {
            // First year - partial year for new job
            const yearStart = new Date(year, 0, 1);
            const joinDateObj = new Date(joinDate);
            
            // Old job would have worked full year
            daysWorkedOld = 365;
            
            // New job worked from join date to end of year
            daysWorkedNew = daysBetween(joinDate, `${year + 1}-01-01`);
        } else {
            // Full years
            daysWorkedOld = 365;
            daysWorkedNew = 365;
        }
        
        // Calculate earnings for this year
        const oldEarnings = (currentOldSalary / 365) * daysWorkedOld;
        const newEarnings = (currentNewSalary / 365) * daysWorkedNew;
        const yearDifference = newEarnings - oldEarnings;
        cumulativeDifference += yearDifference;
        
        const differenceClass = yearDifference >= 0 ? 'positive' : 'negative';
        const cumulativeClass = cumulativeDifference >= 0 ? 'positive' : 'negative';
        
        projectionHTML += `
            <tr>
                <td><strong>${year}</strong></td>
                <td>$${Math.round(oldEarnings).toLocaleString()}<br><small>($${Math.round(currentOldSalary).toLocaleString()}/year)</small></td>
                <td>$${Math.round(newEarnings).toLocaleString()}<br><small>($${Math.round(currentNewSalary).toLocaleString()}/year)</small></td>
                <td class="${differenceClass}">${yearDifference >= 0 ? '+' : ''}$${Math.round(yearDifference).toLocaleString()}</td>
                <td class="${cumulativeClass}">${cumulativeDifference >= 0 ? '+' : ''}$${Math.round(cumulativeDifference).toLocaleString()}</td>
            </tr>
        `;
        
        // Apply annual increases for next year (on October 1st)
        if (jobType === 'permanent') {
            currentOldSalary *= (1 + oldAnnualIncrease / 100);
            currentNewSalary *= (1 + newAnnualIncrease / 100);
        } else {
            // Contract jobs only get old job increases for comparison
            currentOldSalary *= (1 + oldAnnualIncrease / 100);
            // Contract salary stays the same unless renewed
        }
        
        currentOldSalary = Math.round(currentOldSalary);
        currentNewSalary = Math.round(currentNewSalary);
    }
    
    // Add total row
    const totalClass = cumulativeDifference >= 0 ? 'positive' : 'negative';
    projectionHTML += `
        <tr class="total-row">
            <td><strong>10-Year Total</strong></td>
            <td>$${Math.round(cumulativeDifference + unemploymentOldEarnings + lastSalary * 10).toLocaleString()}</td>
            <td>$${Math.round(newSalary * 10 - unemploymentOldEarnings).toLocaleString()}</td>
            <td colspan="2" class="${totalClass}"><strong>${cumulativeDifference >= 0 ? '+' : ''}$${Math.round(cumulativeDifference).toLocaleString()}</strong></td>
        </tr>
    `;

    projectionHTML += `
                </tbody>
            </table>
            
            <div class="projection-notes">
                <p><strong>Notes:</strong></p>
                <ul>
                    <li>Old Job Income: What you would have earned if you stayed at your previous job</li>
                    <li>New Job Income: Actual earnings from your new job</li>
                    <li>Difference: New Job Income - Old Job Income (positive means you're ahead)</li>
                    <li>Annual increases applied every October 1st</li>
                    <li>Contract jobs assume same rate unless manually adjusted</li>
                </ul>
            </div>
        </div>
    `;
    
    return projectionHTML;
}