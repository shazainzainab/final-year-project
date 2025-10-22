const { connectDB, closeDB, sql } = require('../config/database');
require('dotenv').config();

/**
 * Database setup and verification script
 */
async function setupDatabase() {
    console.log('🔧 ViaItalia Database Setup & Verification');
    console.log('==========================================');
    
    try {
        // Test database connection
        console.log('1. Testing database connection...');
        const pool = await connectDB();
        console.log('✅ Database connection successful!');

        // Check if tables exist
        console.log('\n2. Checking database tables...');
        const tables = ['Cities', 'Hotels', 'Restaurants', 'Beaches', 'AttractionPlaces', 'ShoppingMalls'];
        
        for (const table of tables) {
            try {
                const result = await pool.request()
                    .query(`SELECT COUNT(*) as count FROM ${table}`);
                const count = result.recordset[0].count;
                console.log(`✅ Table ${table}: ${count} records found`);
            } catch (error) {
                console.log(`❌ Table ${table}: Not found or inaccessible`);
                console.log(`   Error: ${error.message}`);
            }
        }

        // Test sample queries
        console.log('\n3. Testing sample queries...');
        
        try {
            const citiesResult = await pool.request()
                .query('SELECT TOP 3 CityName FROM Cities ORDER BY CityName');
            console.log('✅ Sample cities query successful');
            console.log('   Cities found:', citiesResult.recordset.map(c => c.CityName).join(', '));
        } catch (error) {
            console.log('❌ Sample cities query failed:', error.message);
        }

        try {
            const hotelsResult = await pool.request()
                .query('SELECT TOP 3 HotelName FROM Hotels ORDER BY Rating DESC');
            console.log('✅ Sample hotels query successful');
            console.log('   Hotels found:', hotelsResult.recordset.map(h => h.HotelName).join(', '));
        } catch (error) {
            console.log('❌ Sample hotels query failed:', error.message);
        }

        console.log('\n🎉 Database setup verification completed!');
        console.log('\n📋 Next Steps:');
        console.log('1. Update your .env file with correct database credentials');
        console.log('2. Make sure your MSSQL server is running');
        console.log('3. Import your TravelDB.sql file if tables are missing');
        console.log('4. Run "npm start" to start the API server');

    } catch (error) {
        console.error('\n❌ Database setup failed:');
        console.error('Error:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Check if MSSQL Server is running');
        console.log('2. Verify database credentials in .env file');
        console.log('3. Ensure TravelDB database exists');
        console.log('4. Check if firewall allows connections to SQL Server');
        console.log('5. For SQL Server Express, ensure TCP/IP is enabled');
    } finally {
        await closeDB();
    }
}

// Run the setup if this file is executed directly
if (require.main === module) {
    setupDatabase();
}

module.exports = setupDatabase;