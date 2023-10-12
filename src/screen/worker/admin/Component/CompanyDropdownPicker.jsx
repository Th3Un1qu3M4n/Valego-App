import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import axios from "axios";
import DropDownPicker from "react-native-dropdown-picker";
import { MyContext } from "../../../../../context/tokenContext";
export default function CompanyDropdownPicker(props) {
  const { token, API_URL } = useContext(MyContext);
  const [companyItems, setCompanyItems] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [allCompanies, setAllCompanies] = useState([]);

  const getSelectCompanyDetails = (selectedCompany) => {
    return allCompanies.find((company) => company._id === selectedCompany);
  };

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const headers = {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(`${API_URL}/api/company`, { headers });
        let temp = [];
        for (const element of response.data) {
          temp.push({ label: element.name, value: element._id });
        }
        setCompanyItems(temp);
        setAllCompanies(response.data);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompanyData();
  }, []);

  return (
    <DropDownPicker
      items={companyItems}
      defaultNull={selectedCompany === null}
      placeholder="Select Company"
      containerStyle={{ width: "100%", marginBottom: 0 }}
      onChangeItem={(item) => {
        setSelectedCompany({ label: item.label, value: item.value });
        props.companyChanged(item.value);
        props.setCompanyDetails(getSelectCompanyDetails(item.value));
      }}
    />
  );
}
