# Creating user 
Returns a JSON containing data for the new created user
* **URL:** <br>
    /users/
* **Method:** <br>
    `POST`
* **URL Params** <br>
	None
**Required:** <br>
    `Data in body`
* **Data Params** <br>
    All the user details completed in the input fields given using body
    ```javascript
        {
            firstName: [string],
            lastName: [string],
            email: [string],
            phone: [string]
       }
       ```
        Note: All specified fields need to take a valid series of input data.

* **Success Response:** <br>
    * **Code:** 200 <br>
      **Content:** 
      ```javascript
        {
            id: 1, 
            firstName: "Ion",
            lastName: "Neculce",
            email: "cronicar@gmail.com",
            phone: "0720557248",
            link: "users/1"
       }
       ```
* **Error Response:** <br>
    * **Code:** 400 FAILED CLIENT REQUEST <br>
      **Content:** 
      ```javascript
      {
        error_fname: “Ati introdus prenumele gresit”,
	    error_lname: “Ati introdus numele gresit”,
	    error_email: “Ati introdus emailul gresit”,
	    error_phone: “Ati introdus gresit numarul de telefon”
      }
      ```
    
