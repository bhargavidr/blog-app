const isValidID = (paramNames) => {
    return (req, res, next) => {
        const pattern = /^[0-9a-fA-F]{24}$/;

        for (const paramName of paramNames) {
            const id = req.params[paramName];
            if (!pattern.test(id)) {
                return res.status(400).send({ error: `Invalid MongoDB ID` });
            }
        }
        next();
    };
};

module.exports = isValidID;

