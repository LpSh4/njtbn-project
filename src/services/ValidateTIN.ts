// src/services/ValidateTIN.ts
import axios from "axios";

export class ValidateTIN {
  private readonly DADATA_API_KEY = "737ce25ffef86315f39992423ad1657f2c3321c6";

  public async isExists(inn: string): Promise<boolean> {
    if (!/^\d{10}$|^\d{12}$/.test(inn)) return false;
    if (!this.validateChecksum(inn)) return false;
    return await this.checkInRegistry(inn);
  }

  private validateChecksum(inn: string): boolean {
    const digits = inn.split("").map(Number);
    const calculate = (coeffs: number[], targetIndex: number): boolean => {
      const checksum = coeffs.reduce((acc, coeff, i) => acc + coeff * (digits[i] ?? 0), 0);
      return (checksum % 11) % 10 === digits[targetIndex];
    };
    if (digits.length === 10) {
      return calculate([2, 4, 10, 3, 5, 9, 4, 6, 8], 9);
    }
    if (digits.length === 12) {
      const firstOk = calculate([7, 2, 4, 10, 3, 5, 9, 4, 6, 8], 10);
      const secondOk = calculate([3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8], 11);
      return firstOk && secondOk;
    }
    return false;
  }

  private async checkInRegistry(inn: string): Promise<boolean> {
    try {
      const response = await axios.post(
        "https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party",
        { query: inn },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${this.DADATA_API_KEY}`,
          },
          timeout: 5000, // Хороший тон для backend-to-backend
        },
      );
      return (response.data?.suggestions?.length ?? 0) > 0;
    } catch {
      return false;
    }
  }
}
