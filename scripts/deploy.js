// scripts/deploy.js
async function main() {
  // Reset mạng
  // await network.provider.request({
  //   method: "hardhat_reset",
  //   params: [],
  // });

  // Lấy người triển khai (deployer)
  const [deployer] = await ethers.getSigners();
  console.log("Triển khai hợp đồng với địa chỉ:", deployer.address);

  // Lấy contract factory
  const SocialNetwork = await ethers.getContractFactory("SocialNetwork");

  // Deploy contract
  const socialNetwork = await SocialNetwork.deploy();
  await socialNetwork.waitForDeployment();

  // Lấy địa chỉ contract đã deploy
  const address = await socialNetwork.getAddress();
  console.log("SocialNetwork đã được triển khai tại:", address);
  console.log(
    "Số dư của người triển khai:",
    (await ethers.provider.getBalance(deployer.address)).toString()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
