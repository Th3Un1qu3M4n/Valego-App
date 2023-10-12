import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import axios from "axios";
import DropDownPicker from "react-native-dropdown-picker";
import { MyContext } from "../../../../../context/tokenContext";
export default function CompanyDropdownPicker({
  setCompanyDetails,
  companyChanged,
}) {
  const { token, API_URL } = useContext(MyContext);
  const [companyItems, setCompanyItems] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [allCompanies, setAllCompanies] = useState([]);
  const [open, setOpen] = useState(false);

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
        // console.log(response.data);
        let temp = [];
        for (const element of response.data) {
          temp.push({ label: element.name, value: element._id });
        }
        console.log(temp);
        setCompanyItems(temp);
        setAllCompanies(response.data);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompanyData();
  }, []);

  return (
    // <View
    //   style={{
    //     width: "100%",
    //     marginBottom: 0,
    //     // zIndex: 100,
    //   }}
    // >
    <DropDownPicker
      open={open}
      value={selectedCompany}
      items={companyItems}
      setOpen={setOpen}
      setValue={(item) => {
        console.log("item", item);
        setSelectedCompany(item);
      }}
      onChangeValue={(value) => {
        console.log(value);
        setCompanyDetails(getSelectCompanyDetails(value));
        companyChanged(value);
        // setSelectedCompany(value);
      }}
      // autoScroll={true}
      // zIndex={1000}
      listMode="SCROLLVIEW"
    />
    // </View>
  );
}
