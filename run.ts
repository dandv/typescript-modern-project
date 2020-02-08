import { Lib } from './Lib';
import Influx from 'influx';
const influx = new Influx.InfluxDB();
const l = new Lib();
l.run();
