import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import GATConv, global_mean_pool
import os

# ✅ FIX: Auto-detect GPU
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

class DeepDrugNet_V4(torch.nn.Module):
    def __init__(self):
        super().__init__()
        # Drug Path
        self.drug_embedding = nn.Embedding(10, 32)
        self.conv1 = GATConv(32, 32, heads=2, dropout=0.1)
        self.bn1 = nn.BatchNorm1d(64)
        self.conv2 = GATConv(64, 64, heads=2, dropout=0.1)
        self.bn2 = nn.BatchNorm1d(128)
        self.conv3 = GATConv(128, 128, heads=1, dropout=0.1)
        self.bn3 = nn.BatchNorm1d(128)
        # Protein Path
        self.prot_embedding = nn.Embedding(22, 32)
        self.prot_conv1 = nn.Conv1d(32, 64, kernel_size=3)
        self.prot_bn1 = nn.BatchNorm1d(64)
        self.prot_conv2 = nn.Conv1d(64, 128, kernel_size=3)
        self.prot_bn2 = nn.BatchNorm1d(128)
        self.prot_conv3 = nn.Conv1d(128, 128, kernel_size=3)
        self.prot_bn3 = nn.BatchNorm1d(128)
        # Head
        self.fc1 = nn.Linear(256, 128)
        self.fc_bn1 = nn.BatchNorm1d(128)
        self.fc2 = nn.Linear(128, 64)
        self.fc_bn2 = nn.BatchNorm1d(64)
        self.out = nn.Linear(64, 1)

    def forward(self, data):
        # Drug
        x, edge_index = data.x, data.edge_index
        x = self.drug_embedding(x)
        x = F.elu(self.conv1(x, edge_index))
        x = F.elu(self.conv2(x, edge_index))
        x = F.elu(self.conv3(x, edge_index))
        drug_vec = self.bn3(global_mean_pool(x, data.batch))
        
        # Protein (Batch Safe Reshape)
        batch_size = data.batch.max().item() + 1
        p = data.protein.view(batch_size, -1)
        
        p = self.prot_embedding(p).permute(0, 2, 1)
        p = F.relu(self.prot_bn1(self.prot_conv1(p)))
        p = F.relu(self.prot_bn2(self.prot_conv2(p)))
        p = F.relu(self.prot_bn3(self.prot_conv3(p)))
        prot_vec = F.max_pool1d(p, p.size(2)).squeeze(2)
        
        # Combined
        combined = torch.cat((drug_vec, prot_vec), dim=1)
        z = F.dropout(F.relu(self.fc_bn1(self.fc1(combined))), p=0.3, training=self.training)
        z = F.relu(self.fc_bn2(self.fc2(z)))
        return self.out(z)

def load_ai_model(model_filename):
    # ✅ FIX: Path Resolution
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(BASE_DIR, model_filename)

    model = DeepDrugNet_V4()
    try:
        if not os.path.exists(model_path):
             print(f"⚠️ Model file not found at: {model_path}")
             return None

        map_loc = DEVICE
        model.load_state_dict(torch.load(model_path, map_location=map_loc))
        model.to(DEVICE)
        model.eval()
        print(f"✅ AI Model Loaded on {DEVICE}!")
        return model
    except Exception as e:
        print(f"⚠️ Model Load Error: {e}")
        return None