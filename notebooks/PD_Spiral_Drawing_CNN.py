import os
import random
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.nn.functional as F
import pytorch_lightning as pl
import matplotlib.pyplot as plt
from tqdm import tqdm
from PIL import Image
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader
from sklearn.metrics import classification_report
from torchvision.utils import make_grid


# Define image transformations
transform = transforms.Compose([
    transforms.RandomRotation(10),
    transforms.RandomHorizontalFlip(),
    transforms.Resize(224),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Load datasets
train_dir = "/data/spiral/training"
test_dir = "/kaggle/spiral/testing"
trainset = datasets.ImageFolder(root=train_dir, transform=transform)
testset = datasets.ImageFolder(root=test_dir, transform=transform)
class_names = trainset.classes

# Define the DataModule
class DataModule(pl.LightningDataModule):
    def __init__(self, train_dir, test_dir, transform=transform, batch_size=32):
        super().__init__()
        self.train_dir = train_dir
        self.test_dir = test_dir
        self.transform = transform
        self.batch_size = batch_size

    def setup(self, stage=None):
        if stage in ('fit', None):
            self.trainset = datasets.ImageFolder(root=self.train_dir, transform=self.transform)
            self.train_dataloader_ = DataLoader(self.trainset, batch_size=self.batch_size, shuffle=True)
        if stage in ('test', None):
            self.testset = datasets.ImageFolder(root=self.test_dir, transform=self.transform)
            self.test_dataloader_ = DataLoader(self.testset, batch_size=self.batch_size)

    def train_dataloader(self):
        return self.train_dataloader_

    def test_dataloader(self):
        return self.test_dataloader_

# Define the CNN Model
class ConvolutionalNetwork(pl.LightningModule):
    def __init__(self, num_classes=len(class_names)):
        super(ConvolutionalNetwork, self).__init__()
        self.conv1 = nn.Conv2d(3, 6, 3, 1)
        self.conv2 = nn.Conv2d(6, 16, 3, 1)
        self.fc1 = nn.Linear(16 * 54 * 54, 120)
        self.fc2 = nn.Linear(120, 84)
        self.fc3 = nn.Linear(84, 20)
        self.fc4 = nn.Linear(20, num_classes)

    def forward(self, x):
        x = F.relu(self.conv1(x))
        x = F.max_pool2d(x, 2, 2)
        x = F.relu(self.conv2(x))
        x = F.max_pool2d(x, 2, 2)
        x = x.view(-1, 16 * 54 * 54)
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = F.relu(self.fc3(x))
        return F.log_softmax(self.fc4(x), dim=1)

    def configure_optimizers(self):
        return torch.optim.Adam(self.parameters(), lr=0.001)

    def _step(self, batch, stage):
        X, y = batch
        y_hat = self(X)
        loss = F.cross_entropy(y_hat, y)
        pred = y_hat.argmax(dim=1, keepdim=True)
        acc = pred.eq(y.view_as(pred)).sum().item() / y.shape[0]
        self.log(f"{stage}_loss", loss)
        self.log(f"{stage}_acc", acc)
        return loss

    def training_step(self, batch, batch_idx):
        return self._step(batch, 'train')

    def validation_step(self, batch, batch_idx):
        self._step(batch, 'val')

    def test_step(self, batch, batch_idx):
        self._step(batch, 'test')

# Training and Testing
if __name__ == '__main__':
    datamodule = DataModule(train_dir=train_dir, test_dir=test_dir)
    model = ConvolutionalNetwork()
    trainer = pl.Trainer(max_epochs=600)
    trainer.fit(model, datamodule)
    trainer.test(model, datamodule)

# Display Sample Images
for images, _ in datamodule.train_dataloader():
    break
im = make_grid(images, nrow=16)

plt.figure(figsize=(12, 12))
plt.imshow(np.transpose(im.numpy(), (1, 2, 0)))

inv_normalize = transforms.Normalize(mean=[-0.485/0.229, -0.456/0.224, -0.406/0.225], std=[1/0.229, 1/0.224, 1/0.225])
im = inv_normalize(im)

plt.figure(figsize=(12, 12))
plt.imshow(np.transpose(im.numpy(), (1, 2, 0)))

# Evaluation
device = torch.device("cpu")
model.eval()
y_true, y_pred = [], []
with torch.no_grad():
    for test_images, test_labels in datamodule.test_dataloader():
        test_images, test_labels = test_images.to(device), test_labels.to(device)
        pred = model(test_images).argmax(dim=1)
        y_true.extend(test_labels.tolist())
        y_pred.extend(pred.tolist())

print(classification_report(y_true, y_pred, target_names=class_names, digits=4))
