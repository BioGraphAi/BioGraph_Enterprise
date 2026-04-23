import httpx
import asyncio

async def test_protein(pdb_id="6lu7"):
    print(f"--- Testing Protein Fetch for {pdb_id} ---")
    
    async with httpx.AsyncClient() as client:
        # 1. EBI
        try:
            url = f"https://www.ebi.ac.uk/pdbe/api/pdb/entry/molecules/{pdb_id}"
            resp = await client.get(url, timeout=10.0)
            print(f"EBI Status: {resp.status_code}")
        except Exception as e:
            print(f"EBI Failed: {type(e).__name__} - {str(e)}")

        # 2. RCSB JSON
        try:
            url = f"https://data.rcsb.org/rest/v1/core/polymer_entity/{pdb_id}/1"
            resp = await client.get(url, timeout=10.0)
            print(f"RCSB JSON Status: {resp.status_code}")
        except Exception as e:
            print(f"RCSB JSON Failed: {type(e).__name__} - {str(e)}")

        # 3. RCSB FASTA
        try:
            url = f"https://www.rcsb.org/fasta/entry/{pdb_id}"
            resp = await client.get(url, timeout=10.0)
            print(f"RCSB FASTA Status: {resp.status_code}")
        except Exception as e:
            print(f"RCSB FASTA Failed: {type(e).__name__} - {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_protein())
