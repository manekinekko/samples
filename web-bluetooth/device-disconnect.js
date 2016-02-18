var bluetoothDevice;

function onDisconnectButtonClick() {
  if (!bluetoothDevice) {
    return;
  }
  log('Disconnecting from Bluetooth Device...');
  if (bluetoothDevice.gatt.connected) {
    bluetoothDevice.gatt.disconnect();
    log('> Bluetooth Device connected: ' + bluetoothDevice.gatt.connected);
  } else {
    log('> Bluetooth Device is already disconnected');
  }
}

function onGattServerDisconnected() {
  log('Page is no longer visible...');
  log('> Bluetooth Device connected: ' + bluetoothDevice.gatt.connected);
}

function onScanButtonClick() {
  'use strict';

  let options = {filters: []};

  let filterService = document.getElementById('service').value;
  if (filterService.startsWith('0x')) {
    filterService = parseInt(filterService, 16);
  }
  if (filterService) {
    options.filters.push({services: [filterService]});
  }

  let filterName = document.getElementById('name').value;
  if (filterName) {
    options.filters.push({name: filterName});
  }

  let filterNamePrefix = document.getElementById('namePrefix').value;
  if (filterNamePrefix) {
    options.filters.push({namePrefix: filterNamePrefix});
  }

  bluetoothDevice = null;
  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice(options)
  .then(device => {
    bluetoothDevice = device;
    bluetoothDevice.addEventListener('gattserverdisconnected', onGattServerDisconnected);
    return connect();
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}

function onReconnectButtonClick() {
  if (!bluetoothDevice) {
    return;
  }
  if (bluetoothDevice.gatt.connected) {
    log('> Bluetooth Device is already connected');
    return;
  }
  connect()
  .catch(error => {
    log('Argh! ' + error);
  });
}

function connect() {
  log('Connecting to Bluetooth Device...');
  return bluetoothDevice.gatt.connect()
  .then(gattServer => {
    log('> Bluetooth Device connected: ' + bluetoothDevice.gatt.connected);
  })
}
