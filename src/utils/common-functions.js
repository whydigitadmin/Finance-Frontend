import axios from 'axios';

export const getCountryByOrgId = async (orgId) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/basicMaster/getCountryByOrgId?orgId=${orgId}`);
    console.log('API Response:', response);

    if (response.status === 200) {
      const countryNameVO = response.data.paramObjectsMap.countryVO.map((country) => country.countryName);
      return countryNameVO;
    } else {
      // Handle error
      console.error('API Error:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export const getStateByCountry = async (orgId, country) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/basicMaster/getAllStateByCountry?orgId=${orgId}&country=${country}`
    );
    console.log('API Response:', response);

    if (response.status === 200) {
      const countryNameVO = response.data.paramObjectsMap.stateVO.map((state) => state.stateName);
      return countryNameVO;
    } else {
      // Handle error
      console.error('API Error:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export const getCityByState = async (orgId, state) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/basicMaster/getAllCityByState?orgid=${orgId}&state=${state}`);
    console.log('API Response:', response);

    if (response.status === 200) {
      const cityNameVO = response.data.paramObjectsMap.cityVO.map((city) => city.cityName);
      return cityNameVO;
    } else {
      // Handle error
      console.error('API Error:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export const getCurrencyByOrgId = async (orgId) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/basicMaster/getCurrencyByOrgId?orgId=${orgId}`);
    console.log('API Response:', response);

    if (response.status === 200) {
      const currencyVO = response.data.paramObjectsMap.currencyVO.map((currency) => currency.currency);
      return currencyVO;
    } else {
      // Handle error
      console.error('API Error:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
