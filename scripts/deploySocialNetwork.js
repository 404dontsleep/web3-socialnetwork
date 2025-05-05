// scripts/deploySocialNetwork.js
async function main() {
  // Lấy người triển khai (deployer)
  const [deployer] = await ethers.getSigners();
  console.log("Triển khai hợp đồng với địa chỉ:", deployer.address);

  // Lấy contract factory
  const SocialNetwork = await ethers.getContractFactory("SocialNetwork");

  // Deploy contract tại địa chỉ cụ thể
  const socialNetwork = await SocialNetwork.attach(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );
  console.log(
    "SocialNetwork đã được triển khai lại tại:",
    await socialNetwork.getAddress()
  );

  console.log(
    "Số dư của người triển khai:",
    (await deployer.getBalance()).toString()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error); 
    process.exit(1);
  });
