const IPFS_API_URL = "http://localhost:5001/api/v0";
const IPFS_GATEWAY_URL = "http://localhost:8080/ipfs";

/**
 * Đăng tải dữ liệu lên IPFS
 * @param data Dữ liệu cần đăng tải
 * @returns CID của file đã đăng tải
 */
export async function uploadToIPFS(data: string): Promise<string> {
  try {
    // Tạo form data
    const formData = new FormData();
    const blob = new Blob([data], { type: "text/plain" });

    formData.append("file", blob);

    // Gọi API để upload lên IPFS
    const response = await fetch(`${IPFS_API_URL}/add`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Không thể upload lên IPFS");
    }

    const result = await response.json();

    return result.Hash;
  } catch (error: any) {
    throw new Error(`Lỗi khi upload lên IPFS: ${error.message}`);
  }
}

export async function readFromIPFS(cid: string): Promise<string> {
  try {
    const response = await fetch(`${IPFS_GATEWAY_URL}/${cid}`);

    if (!response.ok) {
      throw new Error("Không thể đọc dữ liệu từ IPFS");
    }

    const data = await response.text();

    return data;
  } catch (error: any) {
    throw new Error(`Lỗi khi đọc dữ liệu từ IPFS: ${error.message}`);
  }
}
