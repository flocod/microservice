const Account = require("../models/Account.js");
const collectReq = require("../util/collectReq.js");

const httpcode = {
  success: 200, //Code correct
  unauthorized: 401, //le code a expiré.
  forbidden: 403, //Format de mot de pass invalide
  notFound: 404, //debt non existant
  conflict: 409, //votre nouveau mot de pass doit être different de l'ancien
  error: 500, //internal server error
};

function isEmptyField(data) {
  Object.getOwnPropertyNames(data).forEach((elt) => {
    if (isEmpty(data[elt]) && elt != "files") {
      return res.status(httpcode.unauthorized).json({
        status: httpcode.unauthorized,
        message: `Le champ ${elt} ne doit pas être vide`,
        reponse: 0,
      });
    }
  });
}

const isEmpty = (val) => {
  return val === undefined || val == null || val.length <= 0 ? true : false;
};

const isObjEmpty = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

const modified_account_fn = (account_info, body) => {
  console.log("account_info in modified_account_fn", account_info);
  let toUpdate = {};

  toUpdate["id"] = account_info.id;

  isEmpty(body.name)
    ? (toUpdate["name"] = account_info.name)
    : (toUpdate["name"] = body.name);

  isEmpty(body.phone)
    ? (toUpdate["phone"] = account_info.phone)
    : (toUpdate["phone"] = body.phone);

  return toUpdate;
};

const accountControllers = () => {
  const getAll = async (req, res) => {
    try {
      let filter = req.query;

      console.log("filter:", filter);

      let params;
      if (!isObjEmpty(filter)) {
        params = { where: filter, raw: true };
      } else {
        params = {};
      }

      const accounts = await Account.findAll(params);
      return res.status(200).json({ status: 200, response: 1, accounts });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const filterBy = async (req, res) => {
    try {
      let filter = req.query;

      console.log("filter", filter);

      let params;
      if (!isObjEmpty(filter)) {
        params = { where: filter, raw: true };
      } else {
        params = {};
      }

      const account = await Account.findAll(params);

      return res.status(200).json({ success: true, result: account });
    } catch (err) {
      // console.log(err);
      return res.status(500).json({ success: false, result: err });

      // return res.status(500).json({ msg: err });
    }
  };

  const createAccount = async (req, res) => {
    const body = await collectReq(req);

    console.log("body", body);

    isEmptyField(body);

    try {
      const account = await Account.create({
        name: body.name,
        phone: Number(body.phone),
        balance: 5000,
        createAt: String(Date.now()),
        updateAt: String(Date.now()),
      });

      console.log("account ====>", account);

      return res.status(200).json({
        status: httpcode.success,
        message: "le compte a été crée avec succès",
        reponse: 1,
        data: account,
      });
    } catch (error) {
      console.log(error);

      return res.status(httpcode.error).json({
        status: httpcode.error,
        message: error.errors[0].message,
        reponse: 0,
      });
    }
  };

  const updateAccount = async (req, res) => {
    const body = await collectReq(req);

    console.log("body", body);

    isEmptyField(body);

    await Account.findOne({
      where: {
        phone: body.phone,
      },
    })
      .then(async (account_info) => {
        if (account_info === null) {
          let msg = "Compte non trouvé ";
          console.log(msg);
          return res.status(httpcode.notFound).json({
            status: httpcode.notFound,
            message: msg,
            reponse: 0,
            data: {},
          });
        }

        console.log("account_info", account_info.dataValues);

        let toUpdate = modified_account_fn(account_info.dataValues, body);
        const updateAt = String(Date.now());
        await Account.update(
          {
            name: toUpdate.name,
            phone: isEmpty(body.newphone) ? toUpdate.phone : body.newphone,
            updateAt: updateAt,
          },
          {
            where: {
              id: account_info.dataValues.id,
            },
          }
        )
          .then(() => {
            console.log("toUpdate ------------------------", toUpdate);

            toUpdate["updateAt"] = updateAt;

            return res.status(200).json({
              status: httpcode.success,
              message: "Le compte a été modifié avec succès",
              reponse: 1,
              error: "",
              data: toUpdate,
            });
          })
          .catch((error) => {
            console.log("error", error);

            return res.status(200).json({
              status: httpcode.error,
              message: error,
              reponse: 0,
            });
          });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const deleteAccount = async (req, res) => {


    let body = req.query;

    console.log("body", body);


    isEmptyField(body);

    await Account.findOne({
      where: {
        phone: body.phone,
      },
    })
      .then(async (account_info) => {
        if (account_info === null) {
          let msg = "Compte non trouvé ";
          console.log(msg);
          return res.status(httpcode.notFound).json({
            status: httpcode.notFound,
            message: msg,
            reponse: 0,
            data: {},
          });
        }
        console.log("account_info", account_info.dataValues);

        Account.destroy({
          where: { phone: body.phone },
        })
          .then(() => {
            const msg = `Le compte {name: ${account_info.dataValues.name},phone: ${account_info.dataValues.phone}} a été supprimé avec succès.\n`;
            console.log(msg);
            return res.status(httpcode.success).json({
              status: httpcode.success,
              message: msg,
              reponse: 1,
            });
          })
          .catch((error) => {
            const msg = `Une erreur est survenue lors de la suppression du compte {name: ${account_info.dataValues.name},phone: ${account_info.dataValues.phone}}.\n`;

            console.log(error);
            return res.status(httpcode.error).json({
              status: httpcode.error,
              message: msg,
              reponse: 1,
            });
          });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return {
    getAll,
    filterBy,
    deleteAccount,
    updateAccount,
    createAccount,
  };
};

module.exports = accountControllers;
