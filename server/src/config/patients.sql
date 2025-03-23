CREATE TABLE patients (
    PatientID VARCHAR(10) PRIMARY KEY,
    LastName VARCHAR(120) NOT NULL,
    FirstName VARCHAR(120) NOT NULL,
    MiddleName VARCHAR(120),
    DateOfBirth DATE NOT NULL,
    Age INT(3) CHECK (Age >= 0),
    Gender VARCHAR(10) NOT NULL,
    ContactNumber BIGINT(11) NOT NULL,
    MaritalStatus VARCHAR(25),
    Occupation VARCHAR(50),
    Weight INT(3) CHECK (Weight > 0),
    Height INT(3) CHECK (Height > 0),
    Address VARCHAR(240),
    
    GLastName VARCHAR(120),
    GFirstName VARCHAR(120),
    GMiddleName VARCHAR(120),
    GDateOfBirth DATE,
    GAge INT(3) CHECK (GAge >= 0),
    GContactNumber BIGINT(11),
    GRelationship VARCHAR(50),
    GAddress VARCHAR(240)
);
