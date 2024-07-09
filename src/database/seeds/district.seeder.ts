// import { Factory, Seeder } from 'typeorm-seeding';
// import { Connection } from 'typeorm';
// import { District } from '../../modules/location/entities/district.entity';
// import axios from 'axios';

// export class DistrictSeeder implements Seeder {
//   public async run(factory: Factory, connection: Connection): Promise<any> {
//     try {
//       //   await connection.query('DELETE FROM "District";');
//       //   const districtRepository = connection.getRepository('District');
//       //   await districtRepository.clear();

//       const provinceRepository = connection.getRepository('Province');
//       const provinces = await provinceRepository.find();

//       for (let i = 0; i < provinces.length; i++) {
//         const res = await axios.get(
//           `https://vapi.vnappmob.com/api/province/district/${provinces[i].id}`,
//         );
//         const data = res.data.results;
//         for (let j = 0; j < data.length; j++) {
//           const district = new District();
//           district.id = data[j].district_id;
//           district.name = data[j].district_name;
//           district.province_id = provinces[i].id;
//           await connection.manager.save(district);
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }
