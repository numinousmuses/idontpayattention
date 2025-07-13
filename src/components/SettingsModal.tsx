"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Model } from '@/lib/interfaces';
import { 
  getConfig, 
  updateConfig, 
  getModels, 
  addModel, 
  updateModel, 
  deleteModel,
  initializeDatabase 
} from '@/lib/database';

interface SettingsModalProps {
  children?: React.ReactNode;
}

export default function SettingsModal({ children }: SettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [newModel, setNewModel] = useState<Partial<Model>>({
    name: '',
    modelString: '',
    baseUrl: '',
    isOpenai: true,
    apiKey: '',
    defaultColor: 'blue',
  });
  const [batchSize, setBatchSize] = useState(10);

  const colorOptions = [
    'neutral', 'stone', 'zinc', 'slate', 'gray', 'red', 'orange', 'amber',
    'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue',
    'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
  ];

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      await initializeDatabase();
      const [configData, modelsData] = await Promise.all([
        getConfig(),
        getModels()
      ]);
      setModels(modelsData);
      setBatchSize(configData.batchSize);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleSaveBatchSize = async () => {
    try {
      await updateConfig({ batchSize });
      console.log('Batch size updated successfully');
    } catch (error) {
      console.error('Failed to update batch size:', error);
    }
  };

  const handleAddModel = async () => {
    if (!newModel.name || !newModel.modelString || !newModel.baseUrl) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const modelToAdd: Model = {
        name: newModel.name,
        modelString: newModel.modelString,
        baseUrl: newModel.baseUrl,
        isOpenai: newModel.isOpenai || false,
        apiKey: newModel.apiKey || '',
        defaultColor: newModel.defaultColor || 'blue',
      };

      await addModel(modelToAdd);
      setNewModel({
        name: '',
        modelString: '',
        baseUrl: '',
        isOpenai: true,
        apiKey: '',
        defaultColor: 'blue',
      });
      await loadData();
    } catch (error) {
      console.error('Failed to add model:', error);
      alert('Failed to add model. Model name might already exist.');
    }
  };

  const handleEditModel = async (model: Model) => {
    if (!editingModel?.name || !editingModel?.modelString || !editingModel?.baseUrl) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await updateModel(model.name, {
        modelString: editingModel.modelString,
        baseUrl: editingModel.baseUrl,
        isOpenai: editingModel.isOpenai,
        apiKey: editingModel.apiKey,
        defaultColor: editingModel.defaultColor,
      });
      setEditingModel(null);
      await loadData();
    } catch (error) {
      console.error('Failed to update model:', error);
      alert('Failed to update model');
    }
  };

  const handleDeleteModel = async (modelName: string) => {
    if (confirm(`Are you sure you want to delete the model "${modelName}"?`)) {
      try {
        await deleteModel(modelName);
        await loadData();
      } catch (error) {
        console.error('Failed to delete model:', error);
        alert('Failed to delete model');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="neutral" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your AI models and configuration settings.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Batch Size Configuration */}
          <div className="space-y-3">
            <Label htmlFor="batchSize">Batch Size</Label>
            <div className="flex items-center gap-2">
              <Input
                id="batchSize"
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                min="1"
                max="100"
                className="flex-1"
              />
              <Button onClick={handleSaveBatchSize} size="sm">
                Save
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Number of words to process before making an LLM call
            </p>
          </div>

          {/* Models Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">AI Models</h3>
            </div>

            {/* Existing Models */}
            <div className="space-y-2">
              {models.map((model) => (
                <div key={model.name} className="flex items-center justify-between p-3 border rounded-lg">
                  {editingModel?.name === model.name ? (
                    <div className="flex-1 space-y-2">
                      <Input
                        value={editingModel.modelString}
                        onChange={(e) => setEditingModel({ ...editingModel, modelString: e.target.value })}
                        placeholder="Model String"
                      />
                      <Input
                        value={editingModel.baseUrl}
                        onChange={(e) => setEditingModel({ ...editingModel, baseUrl: e.target.value })}
                        placeholder="Base URL"
                      />
                      <Input
                        value={editingModel.apiKey}
                        onChange={(e) => setEditingModel({ ...editingModel, apiKey: e.target.value })}
                        placeholder="API Key"
                        type="password"
                      />
                      <Select
                        value={editingModel.defaultColor}
                        onValueChange={(value) => setEditingModel({ ...editingModel, defaultColor: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleEditModel(model)}>
                          Save
                        </Button>
                        <Button size="sm" variant="neutral" onClick={() => setEditingModel(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <p className="font-medium">{model.name}</p>
                        <p className="text-sm text-gray-600">{model.modelString}</p>
                        <p className="text-xs text-gray-500">
                          Color: {model.defaultColor} | API Key: {model.apiKey ? '****' : 'Not set'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="neutral"
                          onClick={() => setEditingModel(model)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="neutral"
                          onClick={() => handleDeleteModel(model.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Model */}
            <div className="border rounded-lg p-3 space-y-3">
              <h4 className="font-medium">Add New Model</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="newModelName">Name</Label>
                  <Input
                    id="newModelName"
                    value={newModel.name}
                    onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                    placeholder="Model Name"
                  />
                </div>
                <div>
                  <Label htmlFor="newModelString">Model String</Label>
                  <Input
                    id="newModelString"
                    value={newModel.modelString}
                    onChange={(e) => setNewModel({ ...newModel, modelString: e.target.value })}
                    placeholder="gpt-4o"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="newModelBaseUrl">Base URL</Label>
                <Input
                  id="newModelBaseUrl"
                  value={newModel.baseUrl}
                  onChange={(e) => setNewModel({ ...newModel, baseUrl: e.target.value })}
                  placeholder="https://api.openai.com/v1"
                />
              </div>
              <div>
                <Label htmlFor="newModelApiKey">API Key</Label>
                <Input
                  id="newModelApiKey"
                  type="password"
                  value={newModel.apiKey}
                  onChange={(e) => setNewModel({ ...newModel, apiKey: e.target.value })}
                  placeholder="sk-..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="newModelColor">Default Color</Label>
                  <Select
                    value={newModel.defaultColor}
                    onValueChange={(value) => setNewModel({ ...newModel, defaultColor: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="newModelIsOpenai">Is OpenAI Compatible</Label>
                  <Select
                    value={newModel.isOpenai ? 'true' : 'false'}
                    onValueChange={(value) => setNewModel({ ...newModel, isOpenai: value === 'true' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddModel} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Model
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 