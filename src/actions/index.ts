import enroll from './enroll/enroll';
import upload from './upload/upload';
import info from './info/info';
import stream from './stream/index';

export default {
  enroll,
  upload,
  info,
  ...stream,
};
