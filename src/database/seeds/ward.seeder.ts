// import { Factory, Seeder } from 'typeorm-seeding';
// import { Connection } from 'typeorm';
// import { Ward } from '../../modules/location/entities/ward.entity';
// import axios from 'axios';

// export class WardSeeder implements Seeder {
//   public async run(factory: Factory, connection: Connection): Promise<any> {
//     try {
//       console.log('WardSeededffdssfdr');
//       //   const wardRepository = connection.getRepository('Ward');
//       //   await wardRepository.clear();

//       const districtRepository = connection.getRepository('District');
//       const districts = await districtRepository.find();
//       console.log(districts);

//       for (let i = 0; i < districts.length; i++) {
//         const res = await axios.get(
//           `https://vapi.vnappmob.com/api/province/ward/${districts[i].id}`,
//         );
//         const data = res.data.results;
//         for (let j = 0; j < data.length; j++) {
//           const ward = new Ward();
//           ward.id = data[j].ward_id;
//           ward.name = data[j].ward_name;
//           ward.district_id = districts[i].id;
//           await connection.manager.save(ward);
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }
