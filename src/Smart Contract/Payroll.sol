//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Payroll {
    mapping(address=>uint8) public isEmployee;//0-unregisterd , 1- employee, 2- company
    mapping(address=>string) public Name;

    struct salaryStruct{
        uint256 amount;
        uint256 time;
    }

    struct CompanyStruct{
        address[] EmployeeList;
        address[] EmployeeRegisterList;
        salaryStruct[] salaryHistory;
    }

    struct EmployeeStruct{
        salaryStruct[] salaryHistory;
        address company;
        uint256 salary;
    }

    struct EMP{
        address wallet;
        uint256 salary;
        string name;
    }

    mapping(address=> CompanyStruct) Company; //for companies
    mapping(address=> EmployeeStruct) public Employee; //for employees

    function registerEmployee( string memory name) public {
        require(isEmployee[msg.sender]==0, "You have already registerd");
        Name[msg.sender] = name;
        isEmployee[msg.sender] = 1;
    }

    function registerCompany( string memory name) public {
        require(isEmployee[msg.sender]==0, "You have already registerd");
        Name[msg.sender] = name;
        isEmployee[msg.sender] = 2;
    }

    function sendJoinRequest(address companyAddress)public{
        require(isEmployee[msg.sender]==1, "Only Employees can register");
        require(isEmployee[companyAddress]==2, "The wallet address do not belong to company");
        Company[companyAddress].EmployeeRegisterList.push(msg.sender);
    }

    function acceptEmployee(uint256 salary, address employee) public{
        require(isEmployee[msg.sender]==2, "only companies can accept the applications");
        bool found = false;
        uint index;
        uint length = Company[msg.sender].EmployeeRegisterList.length;
        for (uint i = 0; i < length ; i++) {
            if (Company[msg.sender].EmployeeRegisterList[i] == employee) {
                found = true;
                index = i;
                break;
            }
        }
        require(found, "Employee not found");
        //removing from the the waiting list
        delete Company[msg.sender].EmployeeRegisterList[index];
        Company[msg.sender].EmployeeRegisterList[index] = Company[msg.sender].EmployeeRegisterList[length - 1];
        Company[msg.sender].EmployeeRegisterList.pop();
         //adding to the list of employees
        Company[msg.sender].EmployeeList.push(employee);
        Employee[employee].salary = salary;
        Employee[employee].company = msg.sender;
    }

    function rejectEmployee( address employee) public{
        require(isEmployee[msg.sender]==2, "only companies can reject the applications");
        bool found = false;
        uint index;
        uint length = Company[msg.sender].EmployeeRegisterList.length;
        for (uint i = 0; i < length ; i++) {
            if (Company[msg.sender].EmployeeRegisterList[i] == employee) {
                found = true;
                index = i;
                break;
            }
        }
        require(found, "Employee not found");
        //removing from the the waiting list
        delete Company[msg.sender].EmployeeRegisterList[index];
        Company[msg.sender].EmployeeRegisterList[index] = Company[msg.sender].EmployeeRegisterList[length - 1];
        Company[msg.sender].EmployeeRegisterList.pop();
    }

    function changeEmployeeSalary(uint256 newSal, address employee) public{
        require(isEmployee[msg.sender]==2, "only companies can reject the applications");
        bool found = false;
        uint index;
        uint length = Company[msg.sender].EmployeeList.length;
        for (uint i = 0; i < length ; i++) {
            if (Company[msg.sender].EmployeeList[i] == employee) {
                found = true;
                index = i;
                break;
            }
        }
        require(found, "Employee not found");
        Employee[msg.sender].salary = newSal;
    }

    function removeEmployee(address employee) public{
        require(isEmployee[msg.sender]==2, "only companies can remove employees");
        bool found = false;
        uint index;
        uint length = Company[msg.sender].EmployeeList.length;
        for (uint i = 0; i < length ; i++) {
            if (Company[msg.sender].EmployeeList[i] == employee) {
                found = true;
                index = i;
                break;
            }
        }
        require(found, "Employee not found");
        delete Company[msg.sender].EmployeeList[index];
        Company[msg.sender].EmployeeList[index] = Company[msg.sender].EmployeeList[length - 1];
        Company[msg.sender].EmployeeList.pop();
    }
    
   
    function payEmployees() public payable{
        require(isEmployee[msg.sender]==2, "only companies can send salary");
        uint256 totalSal = calculateTotalSalary(msg.sender);
        require(msg.value>= totalSal, "please send the right amount");
        uint length = Company[msg.sender].EmployeeList.length;
        for (uint i = 0; i < length ; i++){
            address addr = Company[msg.sender].EmployeeList[i];
            uint256 sal = Employee[addr].salary;
            payable(addr).transfer(sal * 1 ether);
            Employee[addr].salaryHistory.push(salaryStruct(sal,block.timestamp));
        }
        Company[msg.sender].salaryHistory.push(salaryStruct(totalSal, block.timestamp));
    }
    
    function calculateTotalSalary(address company) public view returns(uint256){
        require(isEmployee[msg.sender]==2, "only companies can send salary");
        uint256 total;
        uint length = Company[company].EmployeeList.length;
        for (uint i = 0; i < length ; i++){
            address addr = Company[msg.sender].EmployeeList[i];
             total+=Employee[addr].salary * 1 ether;
        }
        return total;
    }

    function getEmployeeList(address company) public view returns(EMP[] memory){
        uint length = Company[company].EmployeeList.length;
        EMP[] memory list = new EMP[](length);
        for (uint i = 0; i < length ; i++){
            address addr = Company[company].EmployeeList[i];
            list[i] = EMP(addr, Employee[addr].salary, Name[addr] );
        }
        return list;
    }
    function getWaitingList(address company) public view returns(EMP[] memory){
        uint length = Company[company].EmployeeRegisterList.length;
        EMP[] memory list = new EMP[](length);
        for (uint i = 0; i < length ; i++){
            address addr = Company[company].EmployeeRegisterList[i];
            list[i] = EMP(addr, 0, Name[addr] );
        }
        return list;
    }
    
    function getCompanyTransactions(address company)public view returns(salaryStruct[] memory) {
        return Company[company].salaryHistory;
    }
}