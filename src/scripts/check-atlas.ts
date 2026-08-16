import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkAtlas() {
  const directUri = 'mongodb://mahendranpradhikshalini_db_user:DWooPWW1bHp8xEX8@ac-ero7r32-shard-00-00.gvnkzhk.mongodb.net:27017,ac-ero7r32-shard-00-01.gvnkzhk.mongodb.net:27017,ac-ero7r32-shard-00-02.gvnkzhk.mongodb.net:27017/sithisha-masala-snacks?replicaSet=atlas-mf9tkf-shard-0&ssl=true&authSource=admin';

  console.log('Testing direct seed list connection...');

  try {
    await mongoose.connect(directUri);
    console.log('✅ Direct connection to Atlas successful!');

    const admin = mongoose.connection.db?.admin();
    const dbs = await admin?.listDatabases();
    console.log('Databases on Atlas cluster:', dbs?.databases.map((d) => d.name));

    const collections = await mongoose.connection.db?.listCollections().toArray();
    console.log('Collections in database "sithisha-masala-snacks":', collections?.map((c) => c.name));

    for (const col of collections || []) {
      const count = await mongoose.connection.db?.collection(col.name).countDocuments();
      console.log(` - Collection "${col.name}": ${count} documents`);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Direct connection error:', err);
  }
}

checkAtlas();
