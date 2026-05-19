const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'products.Json');

// Helper to generate the premium placeholder URL
function getImageUrl(text) {
    const encoded = encodeURIComponent(text);
    return `https://placehold.co/600x400/0f172a/0ea5e9?text=${encoded}&font=Montserrat`;
}

// Data expansion definition
const newModelsData = {
    7: [ // Network Rack Cabinet
        { modelName: "12U Wall Mount Rack", price: 200, specs: "12U, 600mm Depth, Wall Mountable" },
        { modelName: "22U Floor Standing", price: 350, specs: "22U, 800mm Depth, Lockable Doors" },
        { modelName: "32U Data Center Rack", price: 500, specs: "32U, 1000mm Depth, Open Frame" },
        { modelName: "42U Enterprise Rack", price: 700, specs: "42U, 1000mm Depth, Vented, Casters" },
        { modelName: "48U High-Density Rack", price: 950, specs: "48U, 1200mm Depth, Cable Management" }
    ],
    9: [ // Network UPS
        { modelName: "APC Back-UPS 650VA", price: 150, specs: "650VA/400W, 8 Outlets, USB Charging" },
        { modelName: "APC Smart-UPS 1000VA", price: 280, specs: "1000VA/700W, Line Interactive" },
        { modelName: "APC Smart-UPS 1500", price: 350, specs: "1500VA/1000W, LCD Display, Network Card" },
        { modelName: "CyberPower 1500PFCLCD", price: 220, specs: "1500VA/1000W, Pure Sine Wave" },
        { modelName: "Eaton 9PX 2200", price: 700, specs: "2200VA, Double Conversion, Hot-Swap Battery" }
    ],
    11: [ // Modem
        { modelName: "Netgear CM1000", price: 150, specs: "DOCSIS 3.1, Gigabit Cable Modem" },
        { modelName: "Arris SURFboard SB8200", price: 140, specs: "DOCSIS 3.1, 32x8 Channels" },
        { modelName: "Motorola MB8611", price: 160, specs: "DOCSIS 3.1, 2.5 Gbps Port" },
        { modelName: "TP-Link TD-W9970", price: 50, specs: "VDSL/ADSL, N300 Wireless Modem Router" },
        { modelName: "D-Link DSL-224", price: 90, specs: "VDSL2/ADSL2+ Wireless N300" }
    ],
    12: [ // Load Balancer
        { modelName: "TP-Link ER605", price: 60, specs: "Gigabit VPN Router, Multi-WAN" },
        { modelName: "Ubiquiti EdgeRouter 4", price: 200, specs: "3 Gigabit Ports, 3.4 Million pps" },
        { modelName: "Peplink Balance 20", price: 300, specs: "Dual-WAN, 150Mbps Throughput" },
        { modelName: "Cisco RV340", price: 600, specs: "Dual WAN, VPN, 4-Port Gigabit" },
        { modelName: "F5 BIG-IP i2000", price: 5000, specs: "Enterprise Application Delivery Controller" }
    ],
    13: [ // Media Converter
        { modelName: "TP-Link MC220L", price: 60, specs: "Gigabit SFP to RJ45" },
        { modelName: "TP-Link MC200CM", price: 45, specs: "Gigabit Multi-Mode Fiber to RJ45" },
        { modelName: "D-Link DMC-700SC", price: 80, specs: "1000Base-T to 1000Base-SX" },
        { modelName: "Trendnet TFC-1000MGA", price: 55, specs: "100/1000Base-T to SFP" },
        { modelName: "StarTech MCM1110MMLC", price: 120, specs: "Gigabit Ethernet to Fiber LC" }
    ],
    14: [ // SFP Module
        { modelName: "Cisco GLC-LH-SM", price: 50, specs: "1000BASE-LX/LH SFP, 1310nm, 10km" },
        { modelName: "Cisco GLC-T", price: 35, specs: "1000BASE-T RJ45 Copper SFP" },
        { modelName: "TP-Link TL-SM311LS", price: 55, specs: "1000BASE-LX SFP, 10km" },
        { modelName: "Ubiquiti UF-MM-1G", price: 20, specs: "1Gbps Multi-Mode SFP, 550m" },
        { modelName: "Finisar FTLX1471D3BCL", price: 80, specs: "10GBASE-LR/LW 10km SFP+" }
    ],
    15: [ // Wireless Controller
        { modelName: "Cisco 3504", price: 750, specs: "Up to 150 APs, 4 Gbps Throughput" },
        { modelName: "Cisco 5520", price: 900, specs: "Up to 1500 APs, 20 Gbps Throughput" },
        { modelName: "Ubiquiti Cloud Key Gen2", price: 200, specs: "UniFi Network Controller, PoE" },
        { modelName: "TP-Link Omada OC200", price: 100, specs: "Hardware Controller for Omada APs" },
        { modelName: "Aruba 7005", price: 1200, specs: "Branch Controller, 16 APs Support" }
    ],
    16: [ // Bridge
        { modelName: "Ubiquiti NanoBeam AC Gen2", price: 100, specs: "5GHz airMAX ac Bridge" },
        { modelName: "Ubiquiti GigaBeam", price: 130, specs: "60GHz Radio with 5GHz Backup" },
        { modelName: "Linksys WET610N", price: 60, specs: "Wireless-N Ethernet Bridge" },
        { modelName: "MikroTik Wireless Wire", price: 200, specs: "1 Gbps Full Duplex 60GHz Bridge" },
        { modelName: "TP-Link CPE710", price: 80, specs: "5GHz 867Mbps 23dBi Outdoor CPE" }
    ],
    17: [ // Repeater
        { modelName: "TP-Link RE305", price: 40, specs: "AC1200, Dual Band, MU-MIMO" },
        { modelName: "TP-Link RE650", price: 80, specs: "AC2600, 4x4 MU-MIMO, Beamforming" },
        { modelName: "Netgear EX6120", price: 45, specs: "AC1200 WiFi Range Extender" },
        { modelName: "Netgear EX8000", price: 150, specs: "Tri-Band, AC3000, 4 Ethernet Ports" },
        { modelName: "Linksys RE7000", price: 70, specs: "AC1900+ WiFi Extender, Roaming" }
    ],
    18: [ // Print Server
        { modelName: "TP-Link TL-PS110U", price: 45, specs: "Single USB 2.0 Port, 10/100Mbps" },
        { modelName: "TP-Link TL-WPS510U", price: 60, specs: "Pocket-Sized Wireless Print Server" },
        { modelName: "StarTech PM1115UW", price: 80, specs: "Wireless N USB Print Server" },
        { modelName: "HP Jetdirect 310x", price: 150, specs: "Fast Ethernet Print Server" },
        { modelName: "IOGEAR GPSU21", price: 40, specs: "1-Port USB 2.0 Print Server" }
    ],
    19: [ // VoIP Gateway
        { modelName: "Grandstream HT802", price: 45, specs: "2 FXS Ports, Ultra-Compact" },
        { modelName: "Grandstream HT818", price: 120, specs: "8 FXS Ports, 2 SIP Profiles" },
        { modelName: "Cisco SPA112", price: 60, specs: "2-Port Phone Adapter" },
        { modelName: "Yeastar TA400", price: 180, specs: "4 FXS Ports Analog Gateway" },
        { modelName: "Patriot SmartNode 4112", price: 250, specs: "2 FXS, VoIP Gateway" }
    ],
    20: [ // Network Card
        { modelName: "TP-Link TG-3468", price: 25, specs: "Gigabit PCIe Network Adapter" },
        { modelName: "Intel PRO/1000 Pt", price: 40, specs: "Dual Port Server Adapter" },
        { modelName: "Intel X540-T2", price: 200, specs: "10GBASE-T Dual Port Ethernet" },
        { modelName: "Mellanox ConnectX-3", price: 150, specs: "10GbE SFP+ Single/Dual Port" },
        { modelName: "Asus PCE-AX58BT", price: 70, specs: "WiFi 6 (802.11ax) PCIe Adapter" }
    ]
};

try {
    const data = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(data);

    products.forEach(product => {
        if (newModelsData[product.id]) {
            // Set the main image for the product category
            product.image = getImageUrl(product.name);
            
            // Re-assign the models array
            product.models = newModelsData[product.id].map(model => {
                return {
                    modelName: model.modelName,
                    price: model.price,
                    specs: model.specs,
                    image: getImageUrl(model.modelName)
                };
            });
        }
    });

    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    console.log('Successfully expanded models and updated images.');
} catch (err) {
    console.error('Error updating products:', err);
}
