# pacificCode
React &amp; .net assignment

db - pacificDB

create tables

CREATE TABLE Department (
    departmentCode VARCHAR(3) PRIMARY KEY,
    departmentName VARCHAR(100) NOT NULL
);

CREATE TABLE Employee (
	employeeID VARCHAR(4) PRIMARY KEY,
	firstName VARCHAR(100) NOT NULL,
	lastName VARCHAR(100) NOT NULL,
	email VARCHAR(50) NOT NULL,
	DOB DATE NOT NULL,
	salary DECIMAL(10,2) NOT NULL,
	departmentCode VARCHAR(100) NOT NULL
);


