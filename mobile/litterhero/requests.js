import constants from './config/constants';
import Storage from './lib/Storage';
import serviceMap from './config/serviceMap';

export const submitTicket = async (image_uri, location, selected) => {
  // Upload the image using the fetch and FormData APIs
  let formData = new FormData();
  // Assume "photo" is the name of the form field the server expects
  let uriParts = image_uri.split('.');
  let fileType = uriParts[uriParts.length - 1];

  formData.append('photo', {
    uri: image_uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  });

  //loc = await getCurrentLocation();
  formData.append('lat', String(location['latitude']));
  formData.append('long', String(location['longitude']));

  // items stored on device
  phone = await Storage.getItem('phone');
  name = await Storage.getItem('name');

  formData.append('phone', phone);
  formData.append('name', name);

  // hardcoded for now
  formData.append('service_code', serviceMap[selected]['service_code']);
  formData.append('description', serviceMap[selected]['description']);

  const url = constants.SERVERNAME + '/tickets';
  // perform fetch request
  return await fetch(url, {
    method: 'POST',
    body: formData,
    header: {
      'content-type': 'multipart/form-data',
    },
  })
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((err) => {
      console.log(err);
      return null;
      //throw err; // Swallow for now
    });
};

export const getTickets = async () => {
  const url = constants.SERVERNAME + '/tickets';
  let tickets = await fetch(url);
  tickets = await tickets.json();
  return tickets;
  /*
  return [
    {
      id: '123',
      type: 'Human Feces',
      url:
        'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/socialmedia/apple/198/pile-of-poo_1f4a9.png',
      status: 'Unclaimed',
      description: 'User entered text',
      location: '5th & Market',
      upvotes: 5,
    },
    {
      id: '132',
      type: 'Pothole',
      url:
        'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/socialmedia/apple/198/pile-of-poo_1f4a9.png',
      status: 'Unclaimed',
      description: 'User entered text',
      location: '1088 11th St.',
      upvotes: 1,
    },
    {
      id: '133',
      type: 'poop',
      url:
        'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/socialmedia/apple/198/pile-of-poo_1f4a9.png',
      status: 'Unclaimed',
      description: 'User entered text',
      location: '5th & Market, SF',
      upvotes: 1,
    },
  ];*/
};

export const loginUser = async (username, number) => {
  const url = constants.SERVERNAME + '/users';

  return await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: {
        username: username,
        number: number,
      },
    }),
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export const getFormattedTimestamp = () => {
  let date = new Date().getDate(); //Current Date
  let month = new Date().getMonth() + 1; //Current Month
  let year = new Date().getFullYear(); //Current Year
  let hours = new Date().getHours(); //Current Hours
  let min = new Date().getMinutes(); //Current Minutes
  let sec = new Date().getSeconds(); //Current Seconds
  return month + '/' + date + '/' + year + ' ' + hours + ':' + min + ':' + sec;
};
