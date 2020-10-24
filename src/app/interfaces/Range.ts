import {Curriculum} from './Curriculum';
import {Schedule} from './Schedule';

export interface Range {
  id: string;
  curriculum_type: string;
  curriculum_name: string;
  curriculum: Curriculum;
  exam_dt: string;
  schedule: Schedule;
}
