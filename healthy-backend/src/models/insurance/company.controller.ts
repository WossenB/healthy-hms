import InsuranceCompany from "./company.model.js";

export const createCompany = async (req, res) => {
  const company = await InsuranceCompany.create(req.body);
  res.json({ message: "Insurance company created", company });
};

export const getCompanies = async (_, res) => {
  const companies = await InsuranceCompany.find();
  res.json(companies);
};

export const updateCompany = async (req, res) => {
  const company = await InsuranceCompany.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json({ message: "Updated", company });
};

export const disableCompany = async (req, res) => {
  const company = await InsuranceCompany.findByIdAndUpdate(
    req.params.id,
    { active: false },
    { new: true }
  );
  res.json({ message: "Company disabled", company });
};
