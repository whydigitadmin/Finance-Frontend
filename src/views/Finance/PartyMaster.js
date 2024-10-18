import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormHelperText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import { useRef, useState, useMemo, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tabs, Tab } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ActionButton from 'utils/ActionButton';
import { getAllActiveCountries, getAllActiveCurrency } from 'utils/CommonFunctions';
import { showToast } from 'utils/toast-component';
import apiCalls from 'apicall';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PartyMaster = () => {
  const [currencies, setCurrencies] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [editId, setEditId] = useState('');
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [formData, setFormData] = useState({
    accountName: '',
    accountNo: '',
    accType: '',
    accountType: '',
    active: true,
    addressOfBranch: '',
    agentName: '',
    airWayBillCode: '',
    airLineCode: '',
    addressBank: '',
    bussinessCate: '',
    businessType: '',
    caf: '',
    carrierCode: '',
    company: '',
    compoundingScheme: '',
    controllingOff: '',
    country: '',
    createdBy: loginUserName,
    creditDays: '',
    creditLimit: '',
    currency: '',
    customerCategory: '',
    customerCoord: '',
    customerType: '',
    gstPartyName: '',
    gstRegistration: '',
    ifscCode: '',
    nameOfBank: '',
    orgId: orgId,
    panName: '',
    panNo: '',
    partyCode: '',
    partyName: '',
    partyVendorEvaluationDTO: {
      commAgreedTerm: '',
      justification: '',
      slaPoints: '',
      basicVenSelected: '',
      boughVendor: ''
    },
    partyType: '',
    psuGovOrg: '',
    remarks: '',
    salesPerson: '',
    supplierType: '',
    swift: '',
    tanNo: ''
  });
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const listViewColumns = [
    { accessorKey: 'partyType', header: 'Party Type', size: 140 },
    { accessorKey: 'partyCode', header: 'Party Code', size: 140 },
    { accessorKey: 'partyName', header: 'Party Name', size: 140 },
    { accessorKey: 'company', header: 'Company', size: 140 }
  ];

  const handleView = () => {
    setListView(!listView);
  };

  const [fieldErrors, setFieldErrors] = useState({
    accType: '',
    accountName: '',
    accountNo: '',
    accountType: '',
    active: true,
    addressOfBranch: '',
    agentName: '',
    airWayBillCode: '',
    airLineCode: '',
    addressBank: '',
    bussinessCate: '',
    businessType: '',
    caf: '',
    carrierCode: '',
    company: '',
    compoundingScheme: '',
    controllingOff: '',
    country: '',
    createdBy: '',
    creditDays: '',
    creditLimit: '',
    currency: '',
    customerCategory: '',
    customerCoord: '',
    customerType: '',
    gstPartyName: '',
    gstRegistration: '',
    ifscCode: '',
    nameOfBank: '',
    panName: '',
    panNo: '',
    partyCode: '',
    partyName: '',
    partyType: '',
    partyVendorEvaluationDTO: {
      commAgreedTerm: '',
      // id: 0,
      justification: '',
      slaPoints: '',
      basicVenSelected: '',
      boughVendor: ''
    },
    psuGovOrg: '',
    remarks: '',
    salesPerson: '',
    supplierType: '',
    swift: '',
    tanNo: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currencyData = await getAllActiveCurrency(orgId);
        setCurrencies(currencyData);

        console.log('currency', currencyData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    fetchData();
    getAllCountries();
    getPartyMasterByOrgId();
  }, []);

  const getAllCountries = async () => {
    try {
      const countryData = await getAllActiveCountries(orgId);
      setCountryList(countryData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };

  const getPartyMasterByOrgId = async () => {
    try {
      const response = await apiCalls('get', `master/getPartyMasterByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.partyMasterVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getPartyMasterById = async (row) => {
    console.log('THE SELECTED getPartyMasterById IS:', row.original.id);
    setEditId(row.original.id);
    try {
      const response = await apiCalls('get', `master/getPartyMasterById?id=${row.original.id}`);
      console.log('API Response:', response);
      if (response.status === true) {
        setListView(false);
        const particularMaster = response.paramObjectsMap.partyMasterVO[0];
        console.log('THE PARTICULAR CUSTOMER IS:', particularMaster);
        setFormData({
          accountName: particularMaster.accountName,
          accountNo: particularMaster.accountNo || '',
          accType: particularMaster.accType,
          accountType: particularMaster.accountType,
          active: particularMaster.active === true,
          addressOfBranch: particularMaster.addressOfBranch,
          agentName: particularMaster.agentName,
          airWayBillCode: particularMaster.airWayBillCode,
          airLineCode: particularMaster.airLineCode,
          addressBank: particularMaster.addressBank,
          bussinessCate: particularMaster.bussinessCate,
          businessType: particularMaster.businessType,
          caf: particularMaster.caf,
          carrierCode: particularMaster.carrierCode,
          company: particularMaster.company,
          compoundingScheme: particularMaster.compoundingScheme,
          controllingOff: particularMaster.controllingOff,
          country: particularMaster.country,
          creditDays: particularMaster.creditDays,
          creditLimit: particularMaster.creditLimit,
          currency: particularMaster.currency,
          customerCategory: particularMaster.customerCategory,
          customerCoord: particularMaster.customerCoord,
          customerType: particularMaster.customerType,
          gstPartyName: particularMaster.gstPartyName,
          gstRegistration: particularMaster.gstRegistration,
          ifscCode: particularMaster.ifscCode,
          nameOfBank: particularMaster.nameOfBank,
          panName: particularMaster.panName,
          panNo: particularMaster.panNo,
          partyCode: particularMaster.partyCode,
          partyName: particularMaster.partyName,
          partyType: particularMaster.partyType,
          psuGovOrg: particularMaster.psuGovOrg,
          salesPerson: particularMaster.salesPerson,
          supplierType: particularMaster.supplierType,
          swift: particularMaster.swift,
          tanNo: particularMaster.tanNo
        });
        setPartyStateData(
          particularMaster.partyStateVO.map((detail) => ({
            id: detail.id,
            state: detail.state || '',
            gstIn: detail.gstIn || '',
            stateNo: detail.stateNo || '',
            contactPerson: detail.contactPerson || '',
            contactPhoneNo: detail.contactPhoneNo || '',
            contactEmail: detail.contactEmail || '',
            stateCode: detail.stateCode || ''
          }))
        );
        setPartyAddressData(
          particularMaster.partyAddressVO.map((detail) => ({
            id: detail.id,
            addressType: detail.addressType || '',
            addressLine1: detail.addressLine1 || '',
            addressLine2: detail.addressLine2 || '',
            addressLine3: detail.addressLine3 || '',
            businessPlace: detail.businessPlace || '',
            city: detail.city || '',
            contactEmail: detail.contactEmail || '',
            contactPerson: detail.contactPerson || '',
            contactPhoneNo: detail.contactPhoneNo || '',
            pincode: detail.pincode || '',
            state: detail.state || '',
            stateGstIn: detail.stateGstIn || ''
          }))
        );
        setPartyDetailsOfDirectors(
          particularMaster.partyDetailsOfDirectorsVO.map((detail) => ({
            id: detail.id,
            name: detail.name || '',
            designation: detail.designation || '',
            phone: detail.phone || '',
            email: detail.email || ''
          }))
        );
        setPartySpecialTDS(
          particularMaster.partySpecialTDSVO.map((detail) => ({
            id: detail.id,
            edPercentage: detail.edPercentage || '',
            rateFrom: detail.rateFrom || '',
            rateTo: detail.rateTo || '',
            surchargePer: detail.surchargePer || '',
            tdsCertifiNo: detail.tdsCertifiNo || '',
            tdsWithPer: detail.tdsWithPer || '',
            tdsWithSec: detail.tdsWithSec || ''
          }))
        );
        setPartyChargesExemption(
          particularMaster.partyChargesExemptionVO.map((detail) => ({
            id: detail.id,
            tdsWithSec: detail.tdsWithSec || '',
            charges: detail.charges || ''
          }))
        );
        setPartyCurrencyMapping(
          particularMaster.partyCurrencyMappingVO.map((detail) => ({
            id: detail.id,
            transCurrency: detail.transCurrency || ''
          }))
        );
        setPartySalesPersonTagging(
          particularMaster.partySalesPersonTaggingVO.map((detail) => ({
            id: detail.id,
            salesPerson: detail.salesPerson || '',
            empCode: detail.empCode || '',
            salesBranch: detail.salesBranch || '',
            effectiveFrom: detail.effectiveFrom ? dayjs(detail.effectiveFrom, 'DD-MM-YYYY') : dayjs(),
            effectiveTill: detail.effectiveTill ? dayjs(detail.effectiveTill, 'DD-MM-YYYY') : dayjs()
          }))
        );
        setPartyTdsExempted(
          particularMaster.partyTdsExemptedVO.map((detail) => ({
            id: detail.id,
            tdsExempCerti: detail.tdsExempCerti || '',
            value: detail.value || '',
            finYear: detail.finYear || ''
          }))
        );
        setPartyPartnerTagging(
          particularMaster.partyPartnerTaggingVO.map((detail) => ({
            id: detail.id,
            partnerName: detail.partnerName || ''
          }))
        );
        // setFormData(
        //   particularMaster.partyVendorEvaluationVO.map((detail) => ({
        //     id: detail.id,
        //     commAgreedTerm: detail.commAgreedTerm || '',
        //     justification: detail.justification || '',
        //     slaPoints: detail.slaPoints || '',
        //     basicVenSelected: detail.basicVenSelected || '',
        //     boughVendor: detail.boughVendor || '',
        //   }))
        // );
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  //   setFieldErrors({ ...fieldErrors, [name]: '' });
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if the name belongs to the nested partyVendorEvaluationDTO
    if (name in formData.partyVendorEvaluationDTO) {
      setFormData({
        ...formData,
        partyVendorEvaluationDTO: {
          ...formData.partyVendorEvaluationDTO,
          [name]: value
        }
      });
    } else {
      // For other top-level form fields
      setFormData({ ...formData, [name]: value });
    }

    // Clear field errors for the respective field
    setFieldErrors({ ...fieldErrors, [name]: '' });
  };

  const handleClear = () => {
    setEditId('');
    setFormData({
      accType: '',
      accountName: '',
      accountNo: '',
      accountType: '',
      active: true,
      addressOfBranch: '',
      agentName: '',
      airWayBillCode: '',
      airLineCode: '',
      addressBank: '',
      bussinessCate: '',
      businessType: '',
      caf: '',
      carrierCode: '',
      company: '',
      compoundingScheme: '',
      controllingOff: '',
      country: '',
      createdBy: '',
      creditDays: '',
      creditLimit: '',
      currency: '',
      customerCategory: '',
      customerCoord: '',
      customerType: '',
      gstPartyName: '',
      gstRegistration: '',
      // id: 0,
      ifscCode: '',
      nameOfBank: '',
      orgId: orgId,
      panName: '',
      panNo: '',
      partyCode: '',
      partyName: '',
      partyType: '',
      partyVendorEvaluationDTO: {
        commAgreedTerm: '',
        id: 0,
        justification: '',
        slaPoints: '',
        basicVenSelected: '',
        boughVendor: ''
      },
      psuGovOrg: '',
      remarks: '',
      salesPerson: '',
      supplierType: '',
      swift: '',
      tanNo: ''
    });
    setFieldErrors({
      accType: '',
      accountName: '',
      accountNo: '',
      accountType: '',
      active: true,
      addressOfBranch: '',
      agentName: '',
      airWayBillCode: '',
      airLineCode: '',
      addressBank: '',
      bussinessCate: '',
      businessType: '',
      caf: '',
      carrierCode: '',
      company: '',
      compoundingScheme: '',
      controllingOff: '',
      country: '',
      createdBy: '',
      creditDays: '',
      creditLimit: '',
      currency: '',
      customerCategory: '',
      customerCoord: '',
      customerType: '',
      gstPartyName: '',
      gstRegistration: '',
      ifscCode: '',
      nameOfBank: '',
      panName: '',
      panNo: '',
      partyCode: '',
      partyName: '',
      partyType: '',
      psuGovOrg: '',
      remarks: '',
      salesPerson: '',
      supplierType: '',
      swift: '',
      tanNo: ''
    });
    setPartyStateData([
      {
        state: '',
        gstIn: '',
        stateNo: '',
        contactPerson: '',
        contactPhoneNo: '',
        contactEmail: '',
        stateCode: ''
      }
    ]);
    setPartyStateDataErrors([]);
    setPartyAddressData([
      {
        addressType: '',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        businessPlace: '',
        city: '',
        contactEmail: '',
        contactPerson: '',
        contactPhoneNo: '',
        pincode: '',
        state: '',
        stateGstIn: ''
      }
    ]);
    setPartyAddressDataErrors([]);
    setPartyDetailsErrors([]);
    setPartyDetailsOfDirectors([
      {
        name: '',
        designation: '',
        phone: '',
        email: ''
      }
    ]);
    setPartySpecialTDSErrors([]);
    setPartySpecialTDS([
      {
        edPercentage: '',
        rateFrom: '',
        rateTo: '',
        surchargePer: '',
        tdsCertifiNo: '',
        tdsWithPer: '',
        tdsWithSec: ''
      }
    ]);
    setPartyChargesExemptionErrors([]);
    setPartyChargesExemption([
      {
        tdsWithSec: '',
        charges: ''
      }
    ]);
    setPartyCurrencyMappingErrors([]);
    setPartyCurrencyMapping([
      {
        transCurrency: ''
      }
    ]);
    setPartySalesPersonErrors([]);
    setPartySalesPersonTagging([
      {
        salesPerson: '',
        empCode: '',
        salesBranch: '',
        effectiveFrom: null,
        effectiveTill: null
      }
    ]);
    setPartyTdsErrors([]);
    setPartyTdsExempted([
      {
        tdsExempCerti: '',
        valueTds: '',
        finYear: ''
      }
    ]);
    setPartyPartnerErrors([]);
    setPartyPartnerTagging([
      {
        partnerName: ''
      }
    ]);
  };

  const [partyStateData, setPartyStateData] = useState([
    {
      sNo: 1,
      state: '',
      gstIn: '',
      stateNo: '',
      contactPerson: '',
      contactPhoneNo: '',
      contactEmail: '',
      stateCode: ''
    }
  ]);

  const [partyStateDataErrors, setPartyStateDataErrors] = useState([
    {
      state: '',
      gstIn: '',
      stateNo: '',
      contactPerson: '',
      contactPhoneNo: '',
      contactEmail: '',
      stateCode: ''
    }
  ]);

  const handleAddRowPartyState = () => {
    const newRow = {
      sNo: Date.now(),
      state: '',
      gstIn: '',
      stateNo: '',
      contactPerson: '',
      contactPhoneNo: '',
      contactEmail: '',
      stateCode: ''
    };
    setPartyStateData([...partyStateData, newRow]);
    setPartyStateDataErrors([
      ...partyStateDataErrors,
      {
        state: '',
        gstIn: '',
        stateNo: '',
        contactPerson: '',
        contactPhoneNo: '',
        contactEmail: '',
        stateCode: ''
      }
    ]);
  };

  const handleDeleteRowPartyState = (id) => {
    setPartyStateData(partyStateData.filter((row) => row.id !== id));
    setPartyStateDataErrors(partyStateDataErrors.filter((_, index) => index !== id - 1));
  };
  const [partyAddressData, setPartyAddressData] = useState([
    {
      addressType: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      businessPlace: '',
      city: '',
      contact: '',
      pincode: '',
      state: '',
      stateGstIn: ''
    }
  ]);

  const [partyAddressDataErrors, setPartyAddressDataErrors] = useState([
    {
      addressType: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      businessPlace: '',
      city: '',
      contact: '',
      pincode: '',
      state: '',
      stateGstIn: ''
    }
  ]);

  const handleAddRowPartyAddress = () => {
    const newRow = {
      sNo: Date.now(),
      addressType: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      businessPlace: '',
      city: '',
      contact: '',
      pincode: '',
      state: '',
      stateGstIn: ''
    };
    setPartyAddressData([...partyAddressData, newRow]);
    setPartyAddressDataErrors([
      ...partyAddressDataErrors,
      {
        addressType: '',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        businessPlace: '',
        city: '',
        contact: '',
        pincode: '',
        state: '',
        stateGstIn: ''
      }
    ]);
  };

  const handleDeleteRowPartyAddress = (id) => {
    setPartyAddressData(partyAddressData.filter((row) => row.id !== id));
    setPartyAddressDataErrors(partyAddressDataErrors.filter((_, index) => index !== id - 1));
  };

  const [partyDetailsOfDirectors, setPartyDetailsOfDirectors] = useState([
    {
      sNo: 1,
      name: '',
      designation: '',
      phone: '',
      email: ''
    }
  ]);

  const [partyDetailsErrors, setPartyDetailsErrors] = useState([
    {
      name: '',
      designation: '',
      phone: '',
      email: ''
    }
  ]);

  const handleAddRowDetailsOfDPO = () => {
    const newRow = {
      sNo: Date.now(),
      name: '',
      designation: '',
      phone: '',
      email: ''
    };
    setPartyDetailsOfDirectors([...partyDetailsOfDirectors, newRow]);
    setPartyDetailsErrors([
      ...partyDetailsErrors,
      {
        name: '',
        designation: '',
        phone: '',
        email: ''
      }
    ]);
  };

  const handleDeleteRowDetailsOfDPO = (id) => {
    setPartyDetailsOfDirectors(partyDetailsOfDirectors.filter((row) => row.id !== id));
    setPartyDetailsErrors(partyDetailsErrors.filter((_, index) => index !== id - 1));
  };

  const [partySpecialTDS, setPartySpecialTDS] = useState([
    {
      sNo: 1,
      edPercentage: '',
      rateFrom: '',
      rateTo: '',
      surchargePer: '',
      tdsCertifiNo: '',
      tdsWithPer: '',
      tdsWithSec: ''
    }
  ]);

  const [partySpecialTDSErrors, setPartySpecialTDSErrors] = useState([
    {
      edPercentage: '',
      rateFrom: '',
      rateTo: '',
      surchargePer: '',
      tdsCertifiNo: '',
      tdsWithPer: '',
      tdsWithSec: ''
    }
  ]);

  const handleAddRowSpecialTdsWhTaxDetail = () => {
    const newRow = {
      sNo: Date.now(),
      edPercentage: '',
      rateFrom: '',
      rateTo: '',
      surchargePer: '',
      tdsCertifiNo: '',
      tdsWithPer: '',
      tdsWithSec: ''
    };
    setPartySpecialTDS([...partySpecialTDS, newRow]);
    setPartySpecialTDSErrors([
      ...partySpecialTDSErrors,
      {
        edPercentage: '',
        rateFrom: '',
        rateTo: '',
        surchargePer: '',
        tdsCertifiNo: '',
        tdsWithPer: '',
        tdsWithSec: ''
      }
    ]);
  };

  const handleDeleteRowSpecialTdsWhTaxDetail = (id) => {
    setPartySpecialTDS(partySpecialTDS.filter((row) => row.id !== id));
    setPartySpecialTDSErrors(partySpecialTDSErrors.filter((_, index) => index !== id - 1));
  };

  const [partyChargesExemption, setPartyChargesExemption] = useState([
    {
      sNo: Date.now(),
      tdsWithSec: '',
      charges: ''
    }
  ]);

  const [partyChargesExemptionErrors, setPartyChargesExemptionErrors] = useState([
    {
      tdsWithSec: '',
      charges: ''
    }
  ]);

  const handleAddRowChargesExemption = () => {
    const newRow = {
      sNo: Date.now(),
      tdsWithSec: '',
      charges: ''
    };
    setPartyChargesExemption([...partyChargesExemption, newRow]);
    setPartyChargesExemptionErrors([
      ...partyChargesExemptionErrors,
      {
        tdsWithSec: '',
        charges: ''
      }
    ]);
  };

  const handleDeleteRowChargesExemption = (id) => {
    setPartyChargesExemption(partyChargesExemption.filter((row) => row.id !== id));
    setPartyChargesExemptionErrors(partyChargesExemptionErrors.filter((_, index) => index !== id - 1));
  };

  const [partyCurrencyMapping, setPartyCurrencyMapping] = useState([
    {
      sNo: Date.now(),
      transCurrency: ''
    }
  ]);

  const [partyCurrencyMappingErrors, setPartyCurrencyMappingErrors] = useState([
    {
      transCurrency: ''
    }
  ]);

  const handleAddRowCurrencyMapping = () => {
    const newRow = {
      sNo: Date.now(),
      transCurrency: ''
    };
    setPartyCurrencyMapping([...partyCurrencyMapping, newRow]);
    setPartyCurrencyMappingErrors([
      ...partyCurrencyMappingErrors,
      {
        transCurrency: ''
      }
    ]);
  };

  const handleDeleteRowCurrencyMapping = (id) => {
    setPartyCurrencyMapping(partyCurrencyMapping.filter((row) => row.id !== id));
    setPartyCurrencyMappingErrors(partyCurrencyMappingErrors.filter((_, index) => index !== id - 1));
  };

  const [partySalesPersonTagging, setPartySalesPersonTagging] = useState([
    {
      sNo: Date.now(),
      effectiveFrom: null,
      effectiveTill: null,
      empCode: '',
      salesBranch: '',
      salesPerson: ''
    }
  ]);

  const [partySalesPersonErrors, setPartySalesPersonErrors] = useState([
    {
      salesPerson: '',
      empCode: '',
      salesBranch: '',
      effectiveFrom: null,
      effectiveTill: null
    }
  ]);

  const handleAddRowSalesPerson = () => {
    const newRow = {
      sNo: Date.now(),
      effectiveFrom: null,
      effectiveTill: null,
      empCode: '',
      salesBranch: '',
      salesPerson: ''
    };
    setPartySalesPersonTagging([...partySalesPersonTagging, newRow]);
    setPartySalesPersonErrors([
      ...partySalesPersonErrors,
      {
        effectiveFrom: null,
        effectiveTill: null,
        empCode: '',
        salesBranch: '',
        salesPerson: ''
      }
    ]);
  };

  const handleDeleteRowSalesPerson = (id) => {
    setPartySalesPersonTagging(partySalesPersonTagging.filter((row) => row.id !== id));
    setPartySalesPersonErrors(partySalesPersonErrors.filter((_, index) => index !== id - 1));
  };

  const [partyTdsExempted, setPartyTdsExempted] = useState([
    {
      sNo: Date.now(),
      finYear: '',
      tdsExempCerti: '',
      value: ''
    }
  ]);

  const [partyTdsErrors, setPartyTdsErrors] = useState([
    {
      finYear: '',
      tdsExempCerti: '',
      value: ''
    }
  ]);

  const handleAddRowTdsExempted = () => {
    const newRow = {
      sNo: Date.now(),
      finYear: '',
      tdsExempCerti: '',
      value: ''
    };
    setPartyTdsExempted([...partyTdsExempted, newRow]);
    setPartyTdsErrors([
      ...partyTdsErrors,
      {
        finYear: '',
        tdsExempCerti: '',
        value: ''
      }
    ]);
  };

  const handleDeleteRowTdsExempted = (id) => {
    setPartyTdsExempted(partyTdsExempted.filter((row) => row.id !== id));
    setPartyTdsErrors(partyTdsErrors.filter((_, index) => index !== id - 1));
  };

  const [partyPartnerTagging, setPartyPartnerTagging] = useState([
    {
      sNo: Date.now(),
      partnerName: ''
    }
  ]);

  const [partyPartnerErrors, setPartyPartnerErrors] = useState([
    {
      partnerName: ''
    }
  ]);

  const handleAddRowPartnerTagging = () => {
    const newRow = {
      sNo: Date.now(),
      partnerName: ''
    };
    setPartyPartnerTagging([...partyPartnerTagging, newRow]);
    setPartyPartnerErrors([
      ...partyPartnerErrors,
      {
        partnerName: ''
      }
    ]);
  };

  const handleDeleteRowPartnerTagging = (id) => {
    setPartyPartnerTagging(partyPartnerTagging.filter((row) => row.id !== id));
    setPartyPartnerErrors(partyPartnerErrors.filter((_, index) => index !== id - 1));
  };

  const [partyVendorEvaluation, setPartyVendorEvaluation] = useState([
    {
      sNo: Date.now(),
      commAgreedTerm: '',
      justification: '',
      slaPoints: '',
      basicVenSelected: '',
      boughVendor: ''
    }
  ]);

  const [partyVendorErrors, setPartyVendorErrors] = useState([
    {
      commAgreedTerm: '',
      justification: '',
      slaPoints: '',
      basicVenSelected: '',
      boughVendor: ''
    }
  ]);

  const handleSave = async () => {
    const errors = {};
    if (!formData.partyType) {
      errors.partyType = 'Party Type is required';
    }
    if (!formData.partyCode) {
      errors.partyCode = 'Party Code is required';
    }
    if (!formData.partyName) {
      errors.partyName = 'Party Name is required';
    }
    if (!formData.gstPartyName) {
      errors.gstPartyName = 'Gst Party Name is required';
    }
    if (!formData.customerType) {
      errors.customerType = 'Customer Type is required';
    }
    // if (!formData.company) {
    //   errors.company = 'Company is required';
    // }
    // if (!formData.customerCategory) {
    //   errors.customerCategory = 'Customer Category is required';
    // }
    if (!formData.agentName) {
      errors.agentName = 'Agent Name is required';
    }
    if (!formData.accountType) {
      errors.accountType = 'Accounts Type is required';
    }
    if (!formData.businessType) {
      errors.businessType = 'Business Type is required';
    }
    if (!formData.carrierCode) {
      errors.carrierCode = 'Carrier Code is required';
    }
    if (!formData.supplierType) {
      errors.supplierType = 'Supplier Type is required';
    }
    if (!formData.salesPerson) {
      errors.salesPerson = 'Sales Person is required';
    }
    if (!formData.customerCoord) {
      errors.customerCoord = 'Customer Coordinator is required';
    }
    if (!formData.accountName) {
      errors.accountName = 'Account Name is required';
    }
    if (!formData.gstRegistration) {
      errors.gstRegistration = 'Gst Registration is required';
    }
    if (!formData.creditLimit) {
      errors.creditLimit = 'Credit Limit is required';
    }
    if (!formData.creditDays) {
      errors.creditDays = 'Credit Days is required';
    }
    if (!formData.panNo) {
      errors.panNo = 'Pan No is required';
    }
    if (!formData.controllingOff) {
      errors.controllingOff = 'Controlling Office is required';
    }
    if (!formData.currency) {
      errors.currency = 'Currency is required';
    }
    if (!formData.panName) {
      errors.panName = 'Pan Name is required';
    }
    if (!formData.airWayBillCode) {
      errors.airWayBillCode = 'AirWay Bill Code is required';
    }
    if (!formData.airLineCode) {
      errors.airLineCode = 'AirLine Code is required';
    }
    if (!formData.tanNo) {
      errors.tanNo = 'Tan No is required';
    }
    if (!formData.bussinessCate) {
      errors.bussinessCate = 'Business Category is required';
    }
    if (!formData.country) {
      errors.country = 'Country is required';
    }
    if (!formData.caf) {
      errors.caf = 'Caf is required';
    }
    // if (!formData.remarks) {
    //   errors.remarks = 'Remarks is required';
    // }
    if (!formData.compoundingScheme) {
      errors.compoundingScheme = 'Compounding Scheme is required';
    }
    if (!formData.psuGovOrg) {
      errors.psuGovOrg = 'Psu is required';
    }
    if (!formData.nameOfBank) {
      errors.nameOfBank = 'Name of Bank is required';
    }
    if (!formData.addressBank) {
      errors.addressBank = 'Branch is required';
    }
    if (!formData.addressOfBranch) {
      errors.addressOfBranch = 'Address of Branch is required';
    }
    if (!formData.accountNo) {
      errors.accountNo = 'Account No is required';
    }
    if (!formData.accType) {
      errors.accType = 'Account Type is required';
    }
    if (!formData.ifscCode) {
      errors.ifscCode = 'Ifsc Code is required';
    }
    if (!formData.swift) {
      errors.swift = 'Swift is required';
    }

    // if (!errors.partyVendorEvaluationDTO) {
    //   errors.partyVendorEvaluationDTO = {};
    // }
    // if (!formData.partyVendorEvaluationDTO.boughVendor) {
    //   errors.partyVendorEvaluationDTO.boughVendor = 'Who Brought Vendor is required';
    // }
    // if (!formData.partyVendorEvaluationDTO.basicVenSelected) {
    //   errors.partyVendorEvaluationDTO.basicVenSelected = 'What Basis Vendor Selected is required';
    // }
    // if (!formData.partyVendorEvaluationDTO.justification) {
    //   errors.partyVendorEvaluationDTO.justification = 'Justification is required';
    // }
    // if (!formData.partyVendorEvaluationDTO.slaPoints) {
    //   errors.partyVendorEvaluationDTO.slaPoints = 'SLA Points is required';
    // }
    // if (!formData.partyVendorEvaluationDTO.commAgreedTerm) {
    //   errors.partyVendorEvaluationDTO.commAgreedTerm = 'Common Agreed Terms is required';
    // }

    let partyStateDataValid = true;
    const newTableErrors = partyStateData.map((row) => {
      const rowErrors = {};
      if (!row.state) {
        rowErrors.state = 'State is required';
        partyStateDataValid = false;
      }
      if (!row.gstIn) {
        rowErrors.gstIn = 'Gst In is required';
        partyStateDataValid = false;
      }
      if (!row.stateNo) {
        rowErrors.stateNo = 'State No is required';
        partyStateDataValid = false;
      }
      if (!row.contactPerson) {
        rowErrors.contactPerson = 'Contact Person is required';
        partyStateDataValid = false;
      }
      if (!row.contactPhoneNo) {
        rowErrors.contactPhoneNo = 'Contact Phone No is required';
        partyStateDataValid = false;
      }
      if (!row.contactEmail) {
        rowErrors.contactEmail = 'Contact Email is required';
        partyStateDataValid = false;
      }
      if (!row.stateCode) {
        rowErrors.stateCode = 'State Code is required';
        partyStateDataValid = false;
      }

      return rowErrors;
    });
    setFieldErrors(errors);

    setPartyStateDataErrors(newTableErrors);

    let partyAddressDataValid = true;
    const newTableErrors1 = partyAddressData.map((row) => {
      const rowErrors = {};
      if (!row.state) {
        rowErrors.state = 'State is required';
        partyAddressDataValid = false;
      }
      if (!row.businessPlace) {
        rowErrors.businessPlace = 'Business Place is required';
        partyAddressDataValid = false;
      }
      if (!row.stateGstIn) {
        rowErrors.stateGstIn = 'State GstIn is required';
        partyAddressDataValid = false;
      }
      if (!row.city) {
        rowErrors.city = 'City Name is required';
        partyAddressDataValid = false;
      }
      if (!row.addressType) {
        rowErrors.addressType = 'Address Type is required';
        partyAddressDataValid = false;
      }
      if (!row.addressLine1) {
        rowErrors.addressLine1 = 'Address Line1 is required';
        partyAddressDataValid = false;
      }
      if (!row.addressLine2) {
        rowErrors.addressLine2 = 'Address Line2 is required';
        partyAddressDataValid = false;
      }
      if (!row.addressLine3) {
        rowErrors.addressLine3 = 'Address Line3 is required';
        partyAddressDataValid = false;
      }
      if (!row.pincode) {
        rowErrors.pincode = 'Pin Code is required';
        partyAddressDataValid = false;
      }
      if (!row.contact) {
        rowErrors.contact = 'Contact is required';
        partyAddressDataValid = false;
      }

      return rowErrors;
    });
    setPartyAddressDataErrors(newTableErrors1);

    let partyDetailsOfDirectorsValid = true;
    const newTableErrors2 = partyDetailsOfDirectors.map((row) => {
      const rowErrors = {};
      if (!row.name) {
        rowErrors.name = 'Name is required';
        partyDetailsOfDirectorsValid = false;
      }
      if (!row.designation) {
        rowErrors.designation = 'Designation is required';
        partyDetailsOfDirectorsValid = false;
      }
      if (!row.phone) {
        rowErrors.phone = 'Phone is required';
        partyDetailsOfDirectorsValid = false;
      }
      if (!row.email) {
        rowErrors.email = 'Email is required';
        partyDetailsOfDirectorsValid = false;
      }

      return rowErrors;
    });
    setPartyDetailsErrors(newTableErrors2);

    let partySpecialTDSValid = true;
    const newTableErrors3 = partySpecialTDS.map((row) => {
      const rowErrors = {};
      if (!row.tdsWithSec) {
        rowErrors.tdsWithSec = 'Tds Section is required';
        partySpecialTDSValid = false;
      }
      if (!row.rateFrom) {
        rowErrors.rateFrom = 'Rate From is required';
        partySpecialTDSValid = false;
      }
      if (!row.rateTo) {
        rowErrors.rateTo = 'Rate To is required';
        partySpecialTDSValid = false;
      }
      if (!row.tdsWithPer) {
        rowErrors.tdsWithPer = 'Tds % is required';
        partySpecialTDSValid = false;
      }
      if (!row.surchargePer) {
        rowErrors.surchargePer = 'Sur % is required';
        partySpecialTDSValid = false;
      }
      if (!row.edPercentage) {
        rowErrors.edPercentage = 'Ed % is required';
        partySpecialTDSValid = false;
      }
      if (!row.tdsCertifiNo) {
        rowErrors.tdsCertifiNo = 'Tds Certificate No is required';
        partySpecialTDSValid = false;
      }

      return rowErrors;
    });
    setPartySpecialTDSErrors(newTableErrors3);

    let partyChargesExemptionValid = true;
    const partyChargesExemptionErrors = partyChargesExemption.map((row) => {
      const rowErrors = {};
      if (!row.tdsWithSec) {
        rowErrors.tdsWithSec = 'Tds Section is required';
        partyChargesExemptionValid = false;
      }
      if (!row.charges) {
        rowErrors.charges = 'Charge is required';
        partyChargesExemptionValid = false;
      }

      return rowErrors;
    });
    setPartyChargesExemptionErrors(partyChargesExemptionErrors);

    let partyCurrencyMappingValid = true;
    const partyCurrencyMappingErrors = partyCurrencyMapping.map((row) => {
      const rowErrors = {};
      if (!row.transCurrency) {
        rowErrors.transCurrency = 'Transaction Currency is required';
        partyCurrencyMappingValid = false;
      }

      return rowErrors;
    });
    setPartyCurrencyMappingErrors(partyCurrencyMappingErrors);

    let partySalesPersonTaggingValid = true;
    const newTableErrors4 = partySalesPersonTagging.map((row) => {
      const rowErrors = {};
      if (!row.salesPerson) {
        rowErrors.salesPerson = 'Sales Person is required';
        partySalesPersonTaggingValid = false;
      }
      if (!row.empCode) {
        rowErrors.empCode = 'Emp Code is required';
        partySalesPersonTaggingValid = false;
      }
      if (!row.salesBranch) {
        rowErrors.salesBranch = 'Sales Branch is required';
        partySalesPersonTaggingValid = false;
      }
      if (!row.effectiveFrom) {
        rowErrors.effectiveFrom = 'Effective From is required';
        partySalesPersonTaggingValid = false;
      }
      if (!row.effectiveTill) {
        rowErrors.effectiveTill = 'Effective Till is required';
        partySalesPersonTaggingValid = false;
      }

      return rowErrors;
    });
    setPartySalesPersonErrors(newTableErrors4);

    let partyTdsExemptedValid = true;
    const newTableErrors5 = partyTdsExempted.map((row) => {
      const rowErrors = {};
      if (!row.tdsExempCerti) {
        rowErrors.tdsExempCerti = 'Tds Exempted Certificate is required';
        partyTdsExemptedValid = false;
      }
      if (!row.value) {
        rowErrors.value = 'Value is required';
        partyTdsExemptedValid = false;
      }
      if (!row.finYear) {
        rowErrors.finYear = 'Fin Year is required';
        partyTdsExemptedValid = false;
      }

      return rowErrors;
    });
    setPartyTdsErrors(newTableErrors5);

    let partyPartnerTaggingValid = true;
    const newTableErrors6 = partyPartnerTagging.map((row) => {
      const rowErrors = {};
      if (!row.partnerName) {
        rowErrors.partnerName = 'Partner Name is required';
        partyPartnerTaggingValid = false;
      }

      return rowErrors;
    });
    setPartyPartnerErrors(newTableErrors6);

    if (
      Object.keys(errors).length === 0 &&
      partyStateDataValid &&
      partyAddressDataValid &&
      partyDetailsOfDirectorsValid &&
      partySpecialTDSValid &&
      partySalesPersonTaggingValid &&
      partyTdsExemptedValid &&
      partyChargesExemptionValid &&
      partyCurrencyMappingValid &&
      partyPartnerTaggingValid
    ) {
      const partyAddressDTO = partyAddressData.map((row) => ({
        addressType: row.addressType,
        addressLine1: row.addressLine1,
        addressLine2: row.addressLine2,
        addressLine3: row.addressLine3,
        businessPlace: row.businessPlace,
        city: row.city,
        contact: row.contact,
        pincode: row.pincode,
        state: row.state,
        stateGstIn: row.stateGstIn
      }));

      const partyStateDTO = partyStateData.map((row) => ({
        contactEmail: row.contactEmail,
        contactPerson: row.contactPerson,
        contactPhoneNo: row.contactPhoneNo,
        gstIn: row.gstIn,
        state: row.state,
        stateCode: row.stateCode,
        stateNo: row.stateNo
      }));

      const partyDetailsOfDirectorsDTO = partyDetailsOfDirectors.map((row) => ({
        designation: row.designation,
        email: row.email,
        name: row.name,
        phone: row.phone
      }));

      const partySpecialTDSDTO = partySpecialTDS.map((row) => ({
        edPercentage: row.edPercentage,
        rateFrom: row.rateFrom,
        rateTo: row.rateTo,
        surchargePer: row.surchargePer,
        tdsCertifiNo: row.tdsCertifiNo,
        tdsWithPer: row.tdsWithPer,
        tdsWithSec: row.tdsWithSec
      }));

      const partyChargesExemptionDTO = partyChargesExemption.map((row) => ({
        charges: row.charges,
        tdsWithSec: row.tdsWithSec
      }));

      const partyCurrencyMappingDTO = partyCurrencyMapping.map((row) => ({
        transCurrency: row.transCurrency
      }));

      const partySalesPersonTaggingDTO = partySalesPersonTagging.map((row) => ({
        effectiveFrom: dayjs(row.effectiveFrom).format('DD-MM-YYYY'),
        effectiveTill: dayjs(row.effectiveTill).format('DD-MM-YYYY'),
        empCode: row.empCode,
        salesBranch: row.salesBranch,
        salesPerson: row.salesPerson
      }));
      const partyTdsExemptedDTO = partyTdsExempted.map((row) => ({
        finYear: row.finYear,
        tdsExempCerti: row.tdsExempCerti,
        value: row.value
      }));
      const partyPartnerTaggingDTO = partyPartnerTagging.map((row) => ({
        partnerName: row.partnerName
      }));

      const saveData = {
        ...(editId && { id: editId }),
        ...formData,
        partyAddressDTO,
        partyStateDTO,
        partyDetailsOfDirectorsDTO,
        partySpecialTDSDTO,
        partyChargesExemptionDTO,
        partyCurrencyMappingDTO,
        partySalesPersonTaggingDTO,
        partyTdsExemptedDTO,
        partyPartnerTaggingDTO
      };

      console.log('DATA TO SAVE', saveData);

      try {
        const response = await apiCalls('put', `master/updateCreatePartyMaster`, saveData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? ' Party Master Updated Successfully' : 'Party Master created successfully');
          handleClear();
          getPartyMasterByOrgId();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Party Master creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('An error occurred while saving the Party Master');
      }
    } else {
      setFieldErrors(errors);
    }
  };

  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
          <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
          <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
          <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
          <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} margin="0 10px 0 10px" />
        </div>
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getPartyMasterById} />
          </div>
        ) : (
          <>
            <div className="row d-flex ml">
              <div className="col-md-3 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.partyType}>
                  <InputLabel id="partyType">Party Type</InputLabel>
                  <Select labelId="partyType" label="Party Type" name="partyType" value={formData.partyType} onChange={handleInputChange}>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                  </Select>
                  {fieldErrors.partyType && <FormHelperText>{fieldErrors.partyType}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="partyCode"
                  fullWidth
                  name="partyCode"
                  label="Party Code"
                  size="small"
                  value={formData.partyCode}
                  onChange={handleInputChange}
                  error={fieldErrors.partyCode}
                  helperText={fieldErrors.partyCode}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="partyName"
                  fullWidth
                  name="partyName"
                  label="Party Name"
                  size="small"
                  value={formData.partyName}
                  onChange={handleInputChange}
                  error={fieldErrors.partyName}
                  helperText={fieldErrors.partyName}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="gstPartyName"
                  fullWidth
                  name="gstPartyName"
                  label="GST Party Name"
                  size="small"
                  value={formData.gstPartyName}
                  onChange={handleInputChange}
                  error={fieldErrors.gstPartyName}
                  helperText={fieldErrors.gstPartyName}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="customerType"
                  fullWidth
                  name="customerType"
                  label="Customer Type"
                  size="small"
                  value={formData.customerType}
                  onChange={handleInputChange}
                  error={fieldErrors.customerType}
                  helperText={fieldErrors.customerType}
                />
              </div>
              {/* <div className="col-md-3 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.company}>
                  <InputLabel id="company">Company</InputLabel>
                  <Select labelId="company" label="Company" name="company" value={formData.company} onChange={handleInputChange}>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                  </Select>
                  {fieldErrors.company && <FormHelperText>{fieldErrors.company}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.customerCategory}>
                  <InputLabel id="customerCategory">Customer Category</InputLabel>
                  <Select
                    labelId="customerCategory"
                    label="Customer Category"
                    name="customerCategory"
                    value={formData.customerCategory}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                  </Select>
                  {fieldErrors.customerCategory && <FormHelperText>{fieldErrors.customerCategory}</FormHelperText>}
                </FormControl>
              </div> */}
              <div className="col-md-3 mb-3">
                <TextField
                  id="agentName"
                  fullWidth
                  name="agentName"
                  label="Agent Name"
                  size="small"
                  value={formData.agentName}
                  onChange={handleInputChange}
                  error={fieldErrors.agentName}
                  helperText={fieldErrors.agentName}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.accountType}>
                  <InputLabel id="accountType">Accounts Type</InputLabel>
                  <Select
                    labelId="accountType"
                    label="Accounts Type"
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="PAYABLE">PAYABLE</MenuItem>
                    <MenuItem value="RECEIVABLE">RECEIVABLE</MenuItem>
                  </Select>
                  {fieldErrors.accountType && <FormHelperText>{fieldErrors.accountType}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.businessType}>
                  <InputLabel id="businessType">Business Type</InputLabel>
                  <Select
                    labelId="businessType"
                    label="Business Type"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="PROPRIETORSHOP">PROPRIETOR SHOP</MenuItem>
                    <MenuItem value="PARTNERSHIP">PARTNER SHIP</MenuItem>
                    <MenuItem value="PRIVATELIMITED">PRIVATE LIMITED</MenuItem>
                    <MenuItem value="LLP">LLP</MenuItem>
                    <MenuItem value="GOVTFIRM">GOVT.FIRM</MenuItem>
                    <MenuItem value="LIMITED">LIMITED</MenuItem>
                    <MenuItem value="NGO">NGO</MenuItem>
                  </Select>
                  {fieldErrors.businessType && <FormHelperText>{fieldErrors.businessType}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="carrierCode"
                  fullWidth
                  name="carrierCode"
                  label="Carrier Code"
                  size="small"
                  value={formData.carrierCode}
                  onChange={handleInputChange}
                  error={fieldErrors.carrierCode}
                  helperText={fieldErrors.carrierCode}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.supplierType}>
                  <InputLabel id="supplierType">Supplier Type</InputLabel>
                  <Select
                    labelId="supplierType"
                    label="Supplier Type"
                    name="supplierType"
                    value={formData.supplierType}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                  </Select>
                  {fieldErrors.supplierType && <FormHelperText>{fieldErrors.supplierType}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="salesPerson"
                  fullWidth
                  name="salesPerson"
                  label="Sales Person"
                  size="small"
                  value={formData.salesPerson}
                  onChange={handleInputChange}
                  error={fieldErrors.salesPerson}
                  helperText={fieldErrors.salesPerson}
                />
              </div>
              {/* <div className="col-md-3 mb-3">
                <TextField
                  id="salesPerson1"
                  fullWidth
                  name="salesPerson1"
                  // label="salesPerson1"
                  size="small"
                  value={formData.salesPerson1}
                  onChange={handleInputChange}
                  error={fieldErrors.salesPerson1}
                  helperText={fieldErrors.salesPerson1}
                />
              </div> */}
              <div className="col-md-3 mb-3">
                <TextField
                  id="customerCoord"
                  fullWidth
                  name="customerCoord"
                  label="Customer Coordinator"
                  size="small"
                  value={formData.customerCoord}
                  onChange={handleInputChange}
                  error={fieldErrors.customerCoord}
                  helperText={fieldErrors.customerCoord}
                />
              </div>
              {/* <div className="col-md-3 mb-3">
                <TextField
                  id="customerCoordinator1"
                  fullWidth
                  name="customerCoordinator1"
                  size="small"
                  value={formData.customerCoordinator1}
                  onChange={handleInputChange}
                  error={fieldErrors.customerCoordinator1}
                  helperText={fieldErrors.customerCoordinator1}
                />
              </div> */}
              <div className="col-md-3 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.accountName}>
                  <InputLabel id="accountName">Account Name</InputLabel>
                  <Select
                    labelId="accountName"
                    label="Account Name"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                  </Select>
                  {fieldErrors.accountName && <FormHelperText>{fieldErrors.accountName}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.gstRegistration}>
                  <InputLabel id="gstRegistration">GST Registered</InputLabel>
                  <Select
                    labelId="gstRegistration"
                    label="GST Registered"
                    name="gstRegistration"
                    value={formData.gstRegistration}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="YES">YES</MenuItem>
                    <MenuItem value="NO">NO</MenuItem>
                  </Select>
                  {fieldErrors.gstRegistration && <FormHelperText>{fieldErrors.gstRegistration}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="creditLimit"
                  fullWidth
                  name="creditLimit"
                  label="Credit Limit"
                  size="small"
                  value={formData.creditLimit}
                  onChange={handleInputChange}
                  error={fieldErrors.creditLimit}
                  helperText={fieldErrors.creditLimit}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="creditDays"
                  fullWidth
                  name="creditDays"
                  label="Credit Days"
                  size="small"
                  value={formData.creditDays}
                  onChange={handleInputChange}
                  error={fieldErrors.creditDays}
                  helperText={fieldErrors.creditDays}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="panNo"
                  fullWidth
                  name="panNo"
                  label="PAN No"
                  size="small"
                  value={formData.panNo}
                  onChange={handleInputChange}
                  error={fieldErrors.panNo}
                  helperText={fieldErrors.panNo}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="controllingOff"
                  fullWidth
                  name="controllingOff"
                  label="Controlling Office"
                  size="small"
                  value={formData.controllingOff}
                  onChange={handleInputChange}
                  error={fieldErrors.controllingOff}
                  helperText={fieldErrors.controllingOff}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">
                    {
                      <span>
                        Currency <span className="asterisk">*</span>
                      </span>
                    }
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Currency"
                    onChange={handleInputChange}
                    name="currency"
                    value={formData.currency}
                  >
                    {currencies.map((item) => (
                      <MenuItem key={item.id} value={item.currency}>
                        {item.currency}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.currency && <FormHelperText style={{ color: 'red' }}>Currency is required</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="panName"
                  fullWidth
                  name="panName"
                  label="Pan Name"
                  size="small"
                  value={formData.panName}
                  onChange={handleInputChange}
                  error={fieldErrors.panName}
                  helperText={fieldErrors.panName}
                />
              </div>

              <div className="col-md-3 mb-3">
                <TextField
                  id="airWayBillCode"
                  fullWidth
                  name="airWayBillCode"
                  label="Air Way Bill Code"
                  size="small"
                  value={formData.airWayBillCode}
                  onChange={handleInputChange}
                  error={fieldErrors.airWayBillCode}
                  helperText={fieldErrors.airWayBillCode}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="airLineCode"
                  fullWidth
                  name="airLineCode"
                  label="AirLine Code"
                  size="small"
                  value={formData.airLineCode}
                  onChange={handleInputChange}
                  error={fieldErrors.airLineCode}
                  helperText={fieldErrors.airLineCode}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="tanNo"
                  fullWidth
                  name="tanNo"
                  label="TAN No"
                  size="small"
                  value={formData.tanNo}
                  onChange={handleInputChange}
                  error={fieldErrors.tanNo}
                  helperText={fieldErrors.tanNo}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.bussinessCate}>
                  <InputLabel id="bussinessCate">Business Category</InputLabel>
                  <Select
                    labelId="bussinessCate"
                    label="Business Category"
                    name="bussinessCate"
                    value={formData.bussinessCate}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                  </Select>
                  {fieldErrors.bussinessCate && <FormHelperText>{fieldErrors.bussinessCate}</FormHelperText>}
                </FormControl>
              </div>
              {/* <div className="col-md-3 mb-3">
                <TextField
                  id="businessCategory1"
                  fullWidth
                  name="businessCategory1"
                  size="small"
                  value={formData.businessCategory1}
                  onChange={handleInputChange}
                  error={fieldErrors.businessCategory1}
                  helperText={fieldErrors.businessCategory1}
                />
              </div> */}

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.country}>
                  <InputLabel id="country-label">Country</InputLabel>
                  <Select labelId="country-label" label="Country" value={formData.country} onChange={handleInputChange} name="country">
                    {Array.isArray(countryList) &&
                      countryList?.map((row) => (
                        <MenuItem key={row.id} value={row.countryName}>
                          {row.countryName}
                        </MenuItem>
                      ))}
                  </Select>
                  {fieldErrors.country && <FormHelperText>{fieldErrors.country}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.caf}>
                  <InputLabel id="caf">CAF</InputLabel>
                  <Select labelId="caf" label="CAF" name="caf" value={formData.caf} onChange={handleInputChange}>
                    <MenuItem value="YES">YES</MenuItem>
                    <MenuItem value="NO">NO</MenuItem>
                  </Select>
                  {fieldErrors.caf && <FormHelperText>{fieldErrors.caf}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="remarks"
                  fullWidth
                  name="remarks"
                  label="Remarks"
                  size="small"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  error={fieldErrors.remarks}
                  helperText={fieldErrors.remarks}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.compoundingScheme}>
                  <InputLabel id="compoundingScheme">Compounding Scheme</InputLabel>
                  <Select
                    labelId="compoundingScheme"
                    label="Compounding Scheme"
                    name="compoundingScheme"
                    value={formData.compoundingScheme}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="YES">YES</MenuItem>
                    <MenuItem value="NO">NO</MenuItem>
                  </Select>
                  {fieldErrors.compoundingScheme && <FormHelperText>{fieldErrors.compoundingScheme}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl variant="outlined" fullWidth size="small" error={!!fieldErrors.psuGovOrg}>
                  <InputLabel id="psuGovOrg">PSU / Govt Organization</InputLabel>
                  <Select
                    labelId="psuGovOrg"
                    label="PSU / Government Organization"
                    name="psuGovOrg"
                    value={formData.psuGovOrg}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="YES">YES</MenuItem>
                    <MenuItem value="NO">NO</MenuItem>
                  </Select>
                  {fieldErrors.psuGovOrg && <FormHelperText>{fieldErrors.gender}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={formData.active} onChange={handleInputChange} name="active" />}
                  label="Active"
                />
              </div>
            </div>
            <div className="d-flex flex-wrap justify-content-start" style={{ marginBottom: '10px' }}>
              <h6 className="col-md-12" style={{ backgroundColor: '#ECEEF4', padding: '10px' }}>
                Bank Details
              </h6>
            </div>
            <div className="row d-flex">
              <div className="col-md-3 mb-3">
                <TextField
                  id="nameOfBank"
                  fullWidth
                  name="nameOfBank"
                  label="Name of Bank"
                  size="small"
                  value={formData.nameOfBank}
                  onChange={handleInputChange}
                  error={fieldErrors.nameOfBank}
                  helperText={fieldErrors.nameOfBank}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="addressBank"
                  fullWidth
                  name="addressBank"
                  label="Branch"
                  size="small"
                  value={formData.addressBank}
                  onChange={handleInputChange}
                  error={fieldErrors.addressBank}
                  helperText={fieldErrors.addressBank}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="addressOfBranch"
                  fullWidth
                  name="addressOfBranch"
                  label="Address of Bank"
                  size="small"
                  value={formData.addressOfBranch}
                  onChange={handleInputChange}
                  error={fieldErrors.addressOfBranch}
                  helperText={fieldErrors.addressOfBranch}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="accountNo"
                  fullWidth
                  name="accountNo"
                  label="Account No"
                  size="small"
                  value={formData.accountNo}
                  onChange={handleInputChange}
                  error={fieldErrors.accountNo}
                  helperText={fieldErrors.accountNo}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="accType"
                  fullWidth
                  name="accType"
                  label="Account Type"
                  size="small"
                  value={formData.accType}
                  onChange={handleInputChange}
                  error={fieldErrors.accType}
                  helperText={fieldErrors.accType}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="ifscCode"
                  fullWidth
                  name="ifscCode"
                  label="IFSC Code"
                  size="small"
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  error={fieldErrors.ifscCode}
                  helperText={fieldErrors.ifscCode}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="swift"
                  fullWidth
                  name="swift"
                  label="SWIFT"
                  size="small"
                  value={formData.swift}
                  onChange={handleInputChange}
                  error={fieldErrors.swift}
                  helperText={fieldErrors.swift}
                />
              </div>
            </div>
            <div className="row mt-2">
              <Box sx={{ width: '100%' }}>
                <Tabs value={tabValue} onChange={handleChangeTab} variant="scrollable" scrollButtons="auto">
                  <Tab label="Party State" />
                  <Tab label="Address" />
                  <Tab label="Details of Directors/Partner/Owner" />
                  <Tab label="Special TDS / WH Tax Detail" />
                  <Tab label="Charges Exemption for Special TDS / WH" />
                  <Tab label="Currency Mapping" />
                  <Tab label="Sales Person Tagging" />
                  <Tab label="TDS Exempted" />
                  <Tab label="Partner Tagging" />
                  <Tab label="Vendor Evaluation" />
                </Tabs>
              </Box>
              <Box sx={{ padding: 2 }}>
                {tabValue === 0 && (
                  <div className="row d-flex ml">
                    <div className="">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowPartyState} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-12">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="table-header">Action</th>
                                <th className="table-header">SNo</th>
                                <th className="table-header">State</th>
                                <th className="table-header">GSTIN</th>
                                <th className="table-header">State No</th>
                                <th className="table-header">Contact Person</th>
                                <th className="table-header">Contact Phone No</th>
                                <th className="table-header">Contact Email</th>
                                <th className="table-header">State Code</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partyStateData.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRowPartyState(row.id)} />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <select
                                      value={row.state}
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const updatedPartyStateData = [...partyStateData];
                                        updatedPartyStateData[index].state = e.target.value;
                                        setPartyStateData(updatedPartyStateData);
                                      }}
                                      className={partyStateDataErrors[index]?.state ? 'error form-control' : 'form-control'}
                                    >
                                      <option value="">-- Select --</option>
                                      <option value="STATE1">STATE1</option>
                                      <option value="STATE2">STATE2</option>
                                    </select>
                                    {partyStateDataErrors[index]?.state && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {partyStateDataErrors[index].state}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.gstIn}
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyStateData((prev) => prev.map((r) => (r.id === row.id ? { ...r, gstIn: value } : r)));
                                        setPartyStateDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], gstIn: !value ? 'GstIn is required' : '' };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyStateDataErrors[index]?.gstIn ? 'error form-control' : 'form-control'}
                                    />
                                    {partyStateDataErrors[index]?.gstIn && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyStateDataErrors[index].gstIn}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="number"
                                      value={row.stateNo}
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyStateData((prev) => prev.map((r) => (r.id === row.id ? { ...r, stateNo: value } : r)));
                                        setPartyStateDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            stateNo: !value ? 'State No is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyStateDataErrors[index]?.stateNo ? 'error form-control' : 'form-control'}
                                    />
                                    {partyStateDataErrors[index]?.stateNo && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyStateDataErrors[index].stateNo}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.contactPerson}
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyStateData((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, contactPerson: value } : r))
                                        );
                                        setPartyStateDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            contactPerson: !value ? 'Contact Person is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyStateDataErrors[index]?.contactPerson ? 'error form-control' : 'form-control'}
                                    />
                                    {partyStateDataErrors[index]?.contactPerson && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyStateDataErrors[index].contactPerson}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.contactPhoneNo}
                                      onChange={(e) => {
                                        const value = e.target.value;

                                        if (/^\d{0,10}$/.test(value)) {
                                          setPartyStateData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, contactPhoneNo: value } : r))
                                          );

                                          setPartyStateDataErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              contactPhoneNo: !value
                                                ? 'Phone is required'
                                                : value.length !== 10
                                                  ? 'Phone number must be exactly 10 digits'
                                                  : ''
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      maxLength="10"
                                      className={partyDetailsErrors[index]?.contactPhoneNo ? 'error form-control' : 'form-control'}
                                    />
                                    {partyStateDataErrors[index]?.contactPhoneNo && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyStateDataErrors[index].contactPhoneNo}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.contactEmail}
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isValidEmail = emailRegex.test(value);

                                        setPartyStateData((prev) => prev.map((r) => (r.id === row.id ? { ...r, contactEmail: value } : r)));

                                        setPartyStateDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            contactEmail: !value
                                              ? 'Contact Email is required'
                                              : !isValidEmail
                                                ? 'Invalid Email Address'
                                                : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyStateDataErrors[index]?.contactEmail ? 'error form-control' : 'form-control'}
                                    />
                                    {partyStateDataErrors[index]?.contactEmail && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyStateDataErrors[index].contactEmail}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.stateCode}
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyStateData((prev) => prev.map((r) => (r.id === row.id ? { ...r, stateCode: value } : r)));
                                        setPartyStateDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            stateCode: !value ? 'State Code is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyStateDataErrors[index]?.stateCode ? 'error form-control' : 'form-control'}
                                    />
                                    {partyStateDataErrors[index]?.stateCode && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyStateDataErrors[index].stateCode}</div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {tabValue === 1 && (
                  <div className="row d-flex ml">
                    <div className="">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowPartyAddress} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-12">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="table-header">Action</th>
                                <th className="table-header">SNo</th>
                                <th className="table-header">State</th>
                                <th className="table-header">Business Place</th>
                                <th className="table-header">State GST IN</th>
                                <th className="table-header">City</th>
                                <th className="table-header">Address Type</th>
                                <th className="table-header">Address Line1</th>
                                <th className="table-header">Address Line2</th>
                                <th className="table-header">Address Line3</th>
                                <th className="table-header">Pin Code</th>
                                <th className="table-header">Contact</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partyAddressData.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRowPartyAddress(row.id)} />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <select
                                      value={row.state}
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const updatedPartyAddressData = [...partyAddressData];
                                        updatedPartyAddressData[index].state = e.target.value;
                                        setPartyStateData(updatedPartyAddressData);
                                      }}
                                      className={partyAddressDataErrors[index]?.state ? 'error form-control' : 'form-control'}
                                    >
                                      <option value="">-- Select --</option>
                                      <option value="STATE1">STATE1</option>
                                      <option value="STATE2">STATE2</option>
                                    </select>
                                    {partyAddressDataErrors[index]?.state && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {partyAddressDataErrors[index].state}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <select
                                      value={row.businessPlace}
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const updatedPartyAddressData = [...partyAddressData];
                                        updatedPartyAddressData[index].businessPlace = e.target.value;
                                        setPartyStateData(updatedPartyAddressData);
                                      }}
                                      className={partyAddressDataErrors[index]?.businessPlace ? 'error form-control' : 'form-control'}
                                    >
                                      <option value="">-- Select --</option>
                                      <option value="STATE1">STATE1</option>
                                      <option value="STATE2">STATE2</option>
                                    </select>
                                    {partyAddressDataErrors[index]?.businessPlace && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {partyAddressDataErrors[index].businessPlace}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.stateGstIn}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) => prev.map((r) => (r.id === row.id ? { ...r, stateGstIn: value } : r)));
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], stateGstIn: !value ? 'State Gst In is required' : '' };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.stateGstIn ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.stateGstIn && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].stateGstIn}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.city}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) => prev.map((r) => (r.id === row.id ? { ...r, city: value } : r)));
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            city: !value ? 'City is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.city ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.city && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].city}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.addressType}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, addressType: value } : r))
                                        );
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            addressType: !value ? 'Address  Type is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.addressType ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.addressType && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].addressType}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.addressLine1}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, addressLine1: value } : r))
                                        );
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            addressLine1: !value ? 'Address Line1 is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.addressLine1 ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.addressLine1 && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].addressLine1}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.addressLine2}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, addressLine2: value } : r))
                                        );
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            addressLine2: !value ? 'Address Line2 is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.addressLine2 ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.addressLine2 && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].addressLine2}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.addressLine3}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, addressLine3: value } : r))
                                        );
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            addressLine3: !value ? 'Address Line3 is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.addressLine3 ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.addressLine3 && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].addressLine3}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="number"
                                      value={row.pincode}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) => prev.map((r) => (r.id === row.id ? { ...r, pincode: value } : r)));
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            pincode: !value ? 'Pin Code is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.pincode ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.pincode && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].pincode}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.contact}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyAddressData((prev) => prev.map((r) => (r.id === row.id ? { ...r, contact: value } : r)));
                                        setPartyAddressDataErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            contact: !value ? 'Contact is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyAddressDataErrors[index]?.contact ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyAddressDataErrors[index]?.contact && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyAddressDataErrors[index].contact}</div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {tabValue === 2 && (
                  <div className="row d-flex ml">
                    <div className="">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowDetailsOfDPO} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-12">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="table-header">Action</th>
                                <th className="table-header">SNo</th>
                                <th className="table-header">Name</th>
                                <th className="table-header">Designation</th>
                                <th className="table-header">Phone</th>
                                <th className="table-header">Email</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partyDetailsOfDirectors.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRowDetailsOfDPO(row.id)} />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.name}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyDetailsOfDirectors((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, name: value } : r))
                                        );
                                        setPartyDetailsErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = { ...newErrors[index], name: !value ? 'Name is required' : '' };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyDetailsErrors[index]?.name ? 'error form-control' : 'form-control'}
                                      // style={{ width: '150px' }}
                                    />
                                    {partyDetailsErrors[index]?.name && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyDetailsErrors[index].name}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.designation}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyDetailsOfDirectors((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, designation: value } : r))
                                        );
                                        setPartyDetailsErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            designation: !value ? 'Designation is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyDetailsErrors[index]?.designation ? 'error form-control' : 'form-control'}
                                      // style={{ width: '150px' }}
                                    />
                                    {partyDetailsErrors[index]?.designation && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyDetailsErrors[index].designation}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.phone}
                                      onChange={(e) => {
                                        const value = e.target.value;

                                        if (/^\d{0,10}$/.test(value)) {
                                          setPartyDetailsOfDirectors((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, phone: value } : r))
                                          );

                                          setPartyDetailsErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              phone: !value
                                                ? 'Phone is required'
                                                : value.length !== 10
                                                  ? 'Phone number must be exactly 10 digits'
                                                  : ''
                                            };
                                            return newErrors;
                                          });
                                        }
                                      }}
                                      maxLength="10"
                                      className={partyDetailsErrors[index]?.phone ? 'error form-control' : 'form-control'}
                                    />
                                    {partyDetailsErrors[index]?.phone && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyDetailsErrors[index].phone}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.email}
                                      style={{ width: '150px' }}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const isValidEmail = emailRegex.test(value);

                                        setPartyDetailsOfDirectors((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, email: value } : r))
                                        );

                                        setPartyDetailsErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            email: !value ? 'Email is required' : !isValidEmail ? 'Invalid Email' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyStateDataErrors[index]?.email ? 'error form-control' : 'form-control'}
                                    />
                                    {partyDetailsErrors[index]?.email && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyDetailsErrors[index].email}</div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {tabValue === 3 && (
                  <div className="row d-flex ml">
                    <div className="">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowSpecialTdsWhTaxDetail} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-12">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="table-header">Action</th>
                                <th className="table-header">SNo</th>
                                <th className="table-header">TDS / WH Section</th>
                                <th className="table-header">Rate From</th>
                                <th className="table-header">Rate To</th>
                                <th className="table-header">TDS / WH %</th>
                                <th className="table-header">SUR %</th>
                                <th className="table-header">ED %</th>
                                <th className="table-header">TDS Certificate No</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partySpecialTDS.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton
                                      title="Delete"
                                      icon={DeleteIcon}
                                      onClick={() => handleDeleteRowSpecialTdsWhTaxDetail(row.id)}
                                    />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <select
                                      value={row.tdsWithSec}
                                      style={{ width: '150px' }}
                                      className={partySpecialTDSErrors[index]?.tdsWithSec ? 'error form-control' : 'form-control'}
                                      onChange={(e) =>
                                        setPartySpecialTDS((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, tdsWithSec: e.target.value } : r))
                                        )
                                      }
                                    >
                                      <option value="">-- Select --</option>
                                      <option value="Yes">Yes</option>
                                      <option value="No">No</option>
                                    </select>
                                    {partySpecialTDSErrors[index]?.tdsWithSec && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {partySpecialTDSErrors[index].tdsWithSec}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="number"
                                      value={row.rateFrom}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartySpecialTDS((prev) => prev.map((r) => (r.id === row.id ? { ...r, rateFrom: value } : r)));
                                        setPartySpecialTDSErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            rateFrom: !value ? 'Rate From is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partySpecialTDSErrors[index]?.rateFrom ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partySpecialTDSErrors[index]?.rateFrom && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySpecialTDSErrors[index].rateFrom}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="number"
                                      value={row.rateTo}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartySpecialTDS((prev) => prev.map((r) => (r.id === row.id ? { ...r, rateTo: value } : r)));
                                        setPartySpecialTDSErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            rateTo: !value ? 'Rate To is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partySpecialTDSErrors[index]?.rateTo ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partySpecialTDSErrors[index]?.rateTo && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySpecialTDSErrors[index].rateTo}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="number"
                                      value={row.tdsWithPer}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartySpecialTDS((prev) => prev.map((r) => (r.id === row.id ? { ...r, tdsWithPer: value } : r)));
                                        setPartySpecialTDSErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            tdsWithPer: !value ? 'Tds Percentage is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partySpecialTDSErrors[index]?.tdsWithPer ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partySpecialTDSErrors[index]?.tdsWithPer && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySpecialTDSErrors[index].tdsWithPer}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="number"
                                      value={row.surchargePer}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartySpecialTDS((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, surchargePer: value } : r))
                                        );
                                        setPartySpecialTDSErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            surchargePer: !value ? 'Sur Percentage is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partySpecialTDSErrors[index]?.surchargePer ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partySpecialTDSErrors[index]?.surchargePer && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySpecialTDSErrors[index].surchargePer}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="number"
                                      value={row.edPercentage}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartySpecialTDS((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, edPercentage: value } : r))
                                        );
                                        setPartySpecialTDSErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            edPercentage: !value ? 'edPercentage is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partySpecialTDSErrors[index]?.edPercentage ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partySpecialTDSErrors[index]?.edPercentage && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySpecialTDSErrors[index].edPercentage}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.tdsCertifiNo}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartySpecialTDS((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, tdsCertifiNo: value } : r))
                                        );
                                        setPartySpecialTDSErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            tdsCertifiNo: !value ? 'Tds Certificate No is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partySpecialTDSErrors[index]?.tdsCertifiNo ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partySpecialTDSErrors[index]?.tdsCertifiNo && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySpecialTDSErrors[index].tdsCertifiNo}</div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {tabValue === 4 && (
                  <div className="row d-flex ml">
                    <div className="">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowChargesExemption} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-6">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="table-header">Action</th>
                                <th className="table-header">SNo</th>
                                <th className="table-header">TDS / WH Section</th>
                                <th className="table-header">Charges</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partyChargesExemption.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton
                                      title="Delete"
                                      icon={DeleteIcon}
                                      onClick={() => handleDeleteRowChargesExemption(row.id)}
                                    />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <select
                                      value={row.tdsWithSec}
                                      className={partyChargesExemptionErrors[index]?.tdsWithSec ? 'error form-control' : 'form-control'}
                                      onChange={(e) =>
                                        setPartyChargesExemption((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, tdsWithSec: e.target.value } : r))
                                        )
                                      }
                                    >
                                      <option value="">-- Select --</option>
                                      <option value="Yes">Yes</option>
                                      <option value="No">No</option>
                                    </select>
                                    {partyChargesExemptionErrors[index]?.tdsWithSec && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {partyChargesExemptionErrors[index].tdsWithSec}
                                      </div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <select
                                      value={row.charges}
                                      className={partyChargesExemptionErrors[index]?.charges ? 'error form-control' : 'form-control'}
                                      onChange={(e) =>
                                        setPartyChargesExemption((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, charges: e.target.value } : r))
                                        )
                                      }
                                    >
                                      <option value="">-- Select --</option>
                                      <option value="Yes">Yes</option>
                                      <option value="No">No</option>
                                    </select>
                                    {partyChargesExemptionErrors[index]?.charges && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {partyChargesExemptionErrors[index].charges}
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {tabValue === 5 && (
                  <div className="row d-flex ml">
                    <div className="">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowCurrencyMapping} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-6">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="table-header">Action</th>
                                <th className="table-header">SNo</th>
                                <th className="table-header">Transaction Currency</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partyCurrencyMapping.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRowCurrencyMapping(row.id)} />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <select
                                      className={partyCurrencyMappingErrors[index]?.transCurrency ? 'error form-control' : 'form-control'}
                                      value={row.transCurrency}
                                      onChange={(e) =>
                                        setPartyCurrencyMapping((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, transCurrency: e.target.value } : r))
                                        )
                                      }
                                    >
                                      <option value="">-- Select --</option>
                                      <option value="Yes">Yes</option>
                                      <option value="No">No</option>
                                    </select>
                                    {partyCurrencyMappingErrors[index]?.transCurrency && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {partyCurrencyMappingErrors[index].transCurrency}
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {tabValue === 6 && (
                  <div className="row d-flex ml">
                    <div className="">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowSalesPerson} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-12">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="table-header">Action</th>
                                <th className="table-header">SNo</th>
                                <th className="table-header">Sales Person</th>
                                <th className="table-header">Emp Code</th>
                                <th className="table-header">Sales Branch</th>
                                <th className="table-header">Effective From</th>
                                <th className="table-header">Effective Till</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partySalesPersonTagging.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRowSalesPerson(row.id)} />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.salesPerson}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartySalesPersonTagging((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, salesPerson: value } : r))
                                        );
                                        setPartySalesPersonErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            salesPerson: !value ? 'Sales Person is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partySalesPersonErrors[index]?.salesPerson ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partySalesPersonErrors[index]?.salesPerson && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySalesPersonErrors[index].salesPerson}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.empCode}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartySalesPersonTagging((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, empCode: value } : r))
                                        );
                                        setPartySalesPersonErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            empCode: !value ? 'Emp Code is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partySalesPersonErrors[index]?.empCode ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partySalesPersonErrors[index]?.empCode && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySalesPersonErrors[index].empCode}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.salesBranch}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartySalesPersonTagging((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, salesBranch: value } : r))
                                        );
                                        setPartySalesPersonErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            salesBranch: !value ? 'Sales Branch is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partySalesPersonErrors[index]?.salesBranch ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partySalesPersonErrors[index]?.salesBranch && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partySalesPersonErrors[index].salesBranch}</div>
                                    )}
                                  </td>

                                  <td className="border px-2 py-2">
                                    <div className="w-100">
                                      <DatePicker
                                        selected={row.effectiveFrom}
                                        className={partySalesPersonErrors[index]?.effectiveFrom ? 'error form-control' : 'form-control'}
                                        onChange={(date) => {
                                          setPartySalesPersonTagging((prev) =>
                                            prev.map((r) =>
                                              r.id === row.id
                                                ? {
                                                    ...r,
                                                    effectiveFrom: date,
                                                    effectiveTill: date > r.effectiveTill ? null : r.effectiveTill
                                                  }
                                                : r
                                            )
                                          );
                                          setPartySalesPersonErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              effectiveFrom: !date ? 'Effective From is required' : '',
                                              effectiveTill:
                                                date && row.effectiveTill && date > row.effectiveTill ? '' : newErrors[index]?.effectiveTill
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        dateFormat="dd-MM-yyyy"
                                        minDate={new Date()}
                                      />
                                      {partySalesPersonErrors[index]?.effectiveFrom && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {partySalesPersonErrors[index].effectiveFrom}
                                        </div>
                                      )}
                                    </div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <DatePicker
                                      selected={row.effectiveTill}
                                      className={partySalesPersonErrors[index]?.effectiveTill ? 'error form-control' : 'form-control'}
                                      onChange={(date) => {
                                        setPartySalesPersonTagging((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, effectiveTill: date } : r))
                                        );
                                        setPartySalesPersonErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            effectiveTill: !date ? 'Effective Till is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      dateFormat="dd-MM-yyyy"
                                      minDate={row.effectiveFrom || new Date()}
                                      disabled={!row.effectiveFrom}
                                    />
                                    {partySalesPersonErrors[index]?.effectiveTill && (
                                      <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                        {partySalesPersonErrors[index].effectiveTill}
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {tabValue === 7 && (
                  <div className="row d-flex ml">
                    <div className="">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowTdsExempted} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-8">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="table-header">Action</th>
                                <th className="table-header">SNo</th>
                                <th className="table-header">TDS Exempted Certificate</th>
                                <th className="table-header">Value</th>
                                <th className="table-header">Fin Year</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partyTdsExempted.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRowTdsExempted(row.id)} />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.tdsExempCerti}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyTdsExempted((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, tdsExempCerti: value } : r))
                                        );
                                        setPartyTdsErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            tdsExempCerti: !value ? 'Tds Exempted Certificate is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyTdsErrors[index]?.tdsExempCerti ? 'error form-control' : 'form-control'}
                                      style={{ width: '100%' }}
                                    />
                                    {partyTdsErrors[index]?.tdsExempCerti && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyTdsErrors[index].tdsExempCerti}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="number"
                                      value={row.value}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyTdsExempted((prev) => prev.map((r) => (r.id === row.id ? { ...r, value: value } : r)));
                                        setPartyTdsErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            value: !value ? 'Value is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyTdsErrors[index]?.value ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyTdsErrors[index]?.value && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyTdsErrors[index].value}</div>
                                    )}
                                  </td>
                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.finYear}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyTdsExempted((prev) => prev.map((r) => (r.id === row.id ? { ...r, finYear: value } : r)));
                                        setPartyTdsErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            finYear: !value ? 'Fin Year is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyTdsErrors[index]?.finYear ? 'error form-control' : 'form-control'}
                                      style={{ width: '150px' }}
                                    />
                                    {partyTdsErrors[index]?.finYear && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyTdsErrors[index].finYear}</div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {tabValue === 8 && (
                  <div className="row d-flex ml">
                    <div className="">
                      <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowPartnerTagging} />
                    </div>
                    <div className="row mt-2">
                      <div className="col-lg-6">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: '#673AB7' }}>
                                <th className="table-header">Action</th>
                                <th className="table-header">SNo</th>
                                <th className="table-header">Partner Name</th>
                              </tr>
                            </thead>
                            <tbody>
                              {partyPartnerTagging.map((row, index) => (
                                <tr key={row.id}>
                                  <td className="border px-2 py-2 text-center">
                                    <ActionButton title="Delete" icon={DeleteIcon} onClick={() => handleDeleteRowPartnerTagging(row.id)} />
                                  </td>
                                  <td className="text-center">
                                    <div className="pt-2">{index + 1}</div>
                                  </td>

                                  <td className="border px-2 py-2">
                                    <input
                                      type="text"
                                      value={row.partnerName}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setPartyPartnerTagging((prev) =>
                                          prev.map((r) => (r.id === row.id ? { ...r, partnerName: value } : r))
                                        );
                                        setPartyPartnerErrors((prev) => {
                                          const newErrors = [...prev];
                                          newErrors[index] = {
                                            ...newErrors[index],
                                            partnerName: !value ? 'Partner Name is required' : ''
                                          };
                                          return newErrors;
                                        });
                                      }}
                                      className={partyPartnerErrors[index]?.partnerName ? 'error form-control' : 'form-control'}
                                      style={{ width: '100%' }}
                                    />
                                    {partyPartnerErrors[index]?.partnerName && (
                                      <div style={{ color: 'red', fontSize: '12px' }}>{partyPartnerErrors[index].partnerName}</div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {tabValue === 9 && (
                  <>
                    <div className="row d-flex mt-3">
                      <div className="col-md-3 mb-3">
                        <TextField
                          id="boughVendor"
                          fullWidth
                          name="boughVendor"
                          label="Who Bought Vendor"
                          size="small"
                          value={formData.partyVendorEvaluationDTO.boughVendor}
                          onChange={handleInputChange}
                          error={partyVendorErrors.boughVendor}
                          helperText={partyVendorErrors.boughVendor}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <TextField
                          id="basicVenSelected"
                          fullWidth
                          name="basicVenSelected"
                          label="What Basis Vendor Selected"
                          size="small"
                          value={formData.partyVendorEvaluationDTO.basicVenSelected}
                          onChange={handleInputChange}
                          error={partyVendorErrors.basicVenSelected}
                          helperText={partyVendorErrors.basicVenSelected}
                        />
                      </div>

                      <div className="col-md-3 mb-3">
                        <TextField
                          id="justification"
                          fullWidth
                          name="justification"
                          label="justification"
                          size="small"
                          value={formData.partyVendorEvaluationDTO.justification}
                          onChange={handleInputChange}
                          error={partyVendorErrors.justification}
                          helperText={partyVendorErrors.justification}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <TextField
                          id="slaPoints"
                          fullWidth
                          name="slaPoints"
                          label="SLA Points"
                          size="small"
                          value={formData.partyVendorEvaluationDTO.slaPoints}
                          onChange={handleInputChange}
                          error={partyVendorErrors.slaPoints}
                          helperText={partyVendorErrors.slaPoints}
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <TextField
                          id="commAgreedTerm"
                          fullWidth
                          name="commAgreedTerm"
                          label="Common Agreed Terms"
                          size="small"
                          value={formData.partyVendorEvaluationDTO.commAgreedTerm}
                          onChange={handleInputChange}
                          error={partyVendorErrors.commAgreedTerm}
                          helperText={partyVendorErrors.commAgreedTerm}
                        />
                      </div>
                    </div>
                  </>
                )}
              </Box>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default PartyMaster;
