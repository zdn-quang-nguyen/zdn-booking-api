// import { Factory, Seeder } from 'typeorm-seeding';
// import { Connection } from 'typeorm';
// import { Province } from '../../modules/location/entities/province.entity';
// import axios from 'axios';
// import { createConnection } from 'typeorm';

// export class ProvinceSeeder implements Seeder {
//   public async run(factory: Factory, connection: Connection): Promise<any> {
//     try {
//       const connection = await createConnection();
//       const provinceRepository = connection.getRepository('Province');
//       await provinceRepository.clear();
//     } catch (error) {
//       console.log(error);
//     }

//     const res = await axios.get('https://vapi.vnappmob.com/api/province');
//     const data = res.data.results;
//     for (let i = 0; i < data.length; i++) {
//       const province = new Province();
//       province.id = data[i].province_id;
//       province.name = data[i].province_name;
//       await connection.manager.save(province);
//     }
//   }
// }
