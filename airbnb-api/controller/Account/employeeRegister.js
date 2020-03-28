// Route (POST): api/employee-register
const handleRegister = async (req, res, db_pool, Joi, CryptoJS) => {
    // handle http request
    const schema = {
        email: Joi.string()
            .email()
            .min(3)
            .max(256)
            .required(),
        password: Joi.string()
            .min(8)
            .required(),
        firstName: Joi.string()
            .max(35)
            .required(),
        middleName: Joi.string().max(35),
        lastName: Joi.string()
            .max(35)
            .required(),
        address: Joi.string()
            .max(255)
            .required(),
        phoneNum: Joi.string()
            .max(15)
            .regex(/^\d*$/)
            .required(),
        country: Joi.string()
            .max(30)
            .required(),
        position: Joi.string()
            .max(30)
            .required(),
        salary: Joi.number()
            .required()
    }
    const { error } = Joi.validate(req.body, schema);
    if (error) {
        res.status(400).json(error.details[0].message);
        return;
    }
    const {
        email,
        password,
        firstName,
        middleName,
        lastName,
        address,
        phoneNum,
        country,
        position,
        salary
    } = req.body;

    // Encrypte the password
    const { words } = CryptoJS.SHA256(password);

    // Make the transaction with the database
    try {
        const client = await db_pool.connect();
        try {
            await client.query('BEGIN');
            // insert into user table
            const userText =
                'INSERT INTO project.usr(firstName, middleName, lastName, email, address, phoneNum) VALUES($1, $2, $3, $4, $5, $6) RETURNING uid;';
            const res1 = await client.query(userText, [
                firstName,
                middleName,
                lastName,
                email,
                address,
                phoneNum
            ]);
            const { uid } = res1.rows[0];
            // insert into employee table
            const employeeText = 
                'INSERT INTO project.employee(uid, country, salary, position) VALUES($1, $2, $3, $4) RETURNING empid;';
            const res2 = await client.query(employeeText, [uid, country, salary, position]);
            const { empid } = res2.rows[0];
            // insert into login table
            const loginText =
                'INSERT INTO project.login(email, password) VALUES($1, $2);';
            await client.query(loginText, [
                email,
                words.toString() // encrypted password
            ]);
            await client.query('COMMIT');
            res.status(200).jsonp({
                uid: uid,
                empid: empid
            });
        } catch (err) {
            console.error(
                'Error during the transaction, ROLLBACK.',
                err.stack
            );
            await client.query('ROLLBACK');
            res.status(400).json('Error during the registration');
        } finally {
            client.release();
        }
    } catch (err) {
        res.status(503).json('Service Unavailable');
        console.error(
            'Error during the connection to the database',
            err.stack
        );
    }
}

module.exports = {
    handleRegister
}