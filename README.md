1.	/auth/signin
i)	Method: POST
ii)	Requirements: Two parameters: mobile number and password in req.body
iii)	Returns: An object with properties 'msg' and 'token'. 'token' returns a JWT token.
iv)	Usage: To get the JWT. The token must be provided in 'x-access-token' header with every request while accessing endpoints from driver’s application. 
2.	/driver/
i)	Method: GET
ii)	Requirements: A x-access-token http header with valid JWT as its value.
iii)	Returns: An object with different properties for the drivers
3.	/driver/checkin
i)	Method: POST
ii)	Requirements: A x-access-token http header with valid JWT as its value.
iii)	Parameters: Two parameters in req.body
(1)	vehicleno:	As a string
(2)	start_km:	A positive integer representing current meter reading
iv)	Returns: An object with the following structure
{
        	"checkedIn":  true,
      	"status":  {
              		  "id":  21,
              		  "driver_id":  "000034",
                		"vehicleno":  "HCL600",
                		"start_km":  "15300"
        	}
   }

4.	/driver/startday
i)	Method:  PUT
ii)	Requirements: A x-access-token http header with valid JWT as its value.
iii)	Parameters: None
iv)	Returns: An object with following structure
{
        		"dayStarted":  true,
        		"updationInfo":  {
                			"fieldCount":  0,
              			  "affectedRows":  1,
                			"insertId":  0,
                			"serverStatus":  2,
                			"warningCount":  0,
                					"message":  "(Rows  matched:  1    Changed:  1    Warnings:  0",
              			  "protocol41":  true,
              			  "changedRows":  1
        		}
	   }

5.	/driver/endday
i)	Method: PUT
ii)	Requirements: A x-access-token http header with valid JWT as its value.
iii)	Parameters: One in request body
(1)	end_km:	A positive integer, it should be the current meter reading on the car
iv)	Returns: 
6.	/driver/hoursperday
i)	Method: GET
ii)	Requirements: A x-access-token http header with valid JWT as its value.
iii)	Parameters: One in request body
(1)	dayToCheckHoursFor:	A date in YYYY-MM-DD format
iv)	Returns: An array with all the entries a driver has for given day. Following is the structure. Each object has hours per day property which represents the hours the driver has worked with each check-in per day.
[
        		{
                			"driver_id":  34,
                			"Hours  For  Day":  "00:27:03",
                			"Date":  "2020-08-19"
        		}, ...
	   ]


7.	driver/takeBreak
i)	Method: POST
ii)	Requirements: A x-access-token http header with valid JWT as its value.
iii)	Parameters: None
iv)	Returns. An object with following structure
{
      		"onBreak":  true,
        		"msg":  "Driver on a break"
	   }		

8.	/driver/resumedriving
i)	Method: PUT
ii)	Requirements: A x-access-token http header with valid JWT as its value.
iii)	Parameters: None
iv)	Returns: Returns an object with following structure
{
        		"resumedDriving":  true,
        		"result":  {
                		"fieldCount":  0,
                		"affectedRows":  1,
                		"insertId":  0,
                		"serverStatus":  2,
                		"warningCount":  0,
                		"message":  "(Rows  matched:  1    Changed:  1    Warnings:  0",
                		"protocol41":  true,
                		"changedRows":  1
                     }

