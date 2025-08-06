import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Tab {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
}

interface Bookmark {
  id: string;
  title: string;
  url: string;
}

interface Download {
  id: string;
  filename: string;
  size: string;
  progress: number;
  status: 'downloading' | 'completed' | 'paused';
}

const Index = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: '1',
      title: 'Добро пожаловать в Nikbrowser',
      url: 'nikbrowser://welcome',
      isActive: true
    }
  ]);
  
  const [addressBarValue, setAddressBarValue] = useState('nikbrowser://welcome');
  const [isIncognitoMode, setIsIncognitoMode] = useState(false);
  const [activePanel, setActivePanel] = useState<'none' | 'bookmarks' | 'downloads' | 'settings'>('none');
  
  const [bookmarks] = useState<Bookmark[]>([
    { id: '1', title: 'Google', url: 'https://google.com' },
    { id: '2', title: 'GitHub', url: 'https://github.com' },
    { id: '3', title: 'poehali.dev', url: 'https://poehali.dev' },
    { id: '4', title: 'YouTube', url: 'https://youtube.com' }
  ]);
  
  const [downloads] = useState<Download[]>([
    { id: '1', filename: 'nikbrowser-setup.exe', size: '45.2 MB', progress: 100, status: 'completed' },
    { id: '2', filename: 'document.pdf', size: '2.1 MB', progress: 75, status: 'downloading' },
    { id: '3', filename: 'image.png', size: '854 KB', progress: 100, status: 'completed' }
  ]);

  const addNewTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: 'Новая вкладка',
      url: 'nikbrowser://newtab',
      isActive: false
    };
    setTabs([...tabs, newTab]);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    const closedTabIndex = tabs.findIndex(tab => tab.id === tabId);
    const wasActive = tabs.find(tab => tab.id === tabId)?.isActive;
    
    if (wasActive && newTabs.length > 0) {
      const newActiveIndex = Math.min(closedTabIndex, newTabs.length - 1);
      newTabs[newActiveIndex].isActive = true;
      setAddressBarValue(newTabs[newActiveIndex].url);
    }
    
    setTabs(newTabs);
  };

  const switchTab = (tabId: string) => {
    const newTabs = tabs.map(tab => ({
      ...tab,
      isActive: tab.id === tabId
    }));
    setTabs(newTabs);
    const activeTab = newTabs.find(tab => tab.isActive);
    if (activeTab) {
      setAddressBarValue(activeTab.url);
    }
  };

  const navigateToUrl = (url: string) => {
    const updatedTabs = tabs.map(tab => 
      tab.isActive ? { ...tab, url, title: url.includes('://') ? url.split('://')[1] : url } : tab
    );
    setTabs(updatedTabs);
    setAddressBarValue(url);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let url = addressBarValue;
    if (!url.includes('://')) {
      url = `https://${url}`;
    }
    navigateToUrl(url);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Browser Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        {/* Tab Bar */}
        <div className="flex items-center px-2 pt-2 bg-slate-50">
          <div className="flex-1 flex items-center space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`group flex items-center min-w-[200px] max-w-[240px] px-3 py-2 rounded-t-lg cursor-pointer transition-all ${
                  tab.isActive
                    ? 'bg-white border-t border-l border-r border-slate-200 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
                onClick={() => switchTab(tab.id)}
              >
                <Icon name="Globe" size={14} className="mr-2 text-slate-500" />
                <span className="flex-1 text-sm truncate text-slate-700">
                  {tab.title}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 hover:bg-slate-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                >
                  <Icon name="X" size={12} />
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={addNewTab}
              className="h-8 w-8 rounded-full hover:bg-slate-200 ml-2"
            >
              <Icon name="Plus" size={16} />
            </Button>
          </div>
          
          {/* Mode Toggle */}
          <div className="ml-4 mr-2">
            <Button
              variant={isIncognitoMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsIncognitoMode(!isIncognitoMode)}
              className="text-xs"
            >
              {isIncognitoMode ? (
                <><Icon name="EyeOff" size={14} className="mr-1" /> Инкогнито</>
              ) : (
                <><Icon name="Eye" size={14} className="mr-1" /> Обычный</>
              )}
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center px-4 py-3 space-x-3 bg-white">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" disabled>
              <Icon name="ArrowLeft" size={18} />
            </Button>
            <Button variant="ghost" size="sm" disabled>
              <Icon name="ArrowRight" size={18} />
            </Button>
            <Button variant="ghost" size="sm">
              <Icon name="RotateCcw" size={18} />
            </Button>
          </div>

          {/* Address Bar */}
          <form onSubmit={handleAddressSubmit} className="flex-1 mx-4">
            <div className="relative">
              <Icon name="Lock" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" />
              <Input
                value={addressBarValue}
                onChange={(e) => setAddressBarValue(e.target.value)}
                className="pl-10 pr-10 py-2 bg-slate-50 border-slate-200 rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="Введите URL или поисковый запрос..."
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full"
              >
                <Icon name="Search" size={16} />
              </Button>
            </div>
          </form>

          {/* Toolbar Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant={activePanel === 'bookmarks' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActivePanel(activePanel === 'bookmarks' ? 'none' : 'bookmarks')}
            >
              <Icon name="Bookmark" size={18} />
            </Button>
            <Button
              variant={activePanel === 'downloads' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActivePanel(activePanel === 'downloads' ? 'none' : 'downloads')}
            >
              <Icon name="Download" size={18} />
            </Button>
            <Button
              variant={activePanel === 'settings' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActivePanel(activePanel === 'settings' ? 'none' : 'settings')}
            >
              <Icon name="Settings" size={18} />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Quick Access Bar */}
          {activePanel === 'none' && (
            <div className="bg-white border-b border-slate-200 px-4 py-2">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-600 font-medium">Быстрый доступ:</span>
                {bookmarks.slice(0, 6).map((bookmark) => (
                  <Button
                    key={bookmark.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateToUrl(bookmark.url)}
                    className="text-xs"
                  >
                    <Icon name="Globe" size={14} className="mr-1" />
                    {bookmark.title}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Browser Content */}
          <div className="flex-1 bg-white m-4 rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            {addressBarValue === 'nikbrowser://welcome' ? (
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center max-w-2xl px-8">
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                      Nikbrowser
                    </h1>
                    <p className="text-xl text-slate-600 mb-8">
                      Современный браузер для быстрой и безопасной работы в интернете
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-blue-200 hover:border-blue-400">
                      <Icon name="Zap" size={32} className="text-blue-600 mx-auto mb-4" />
                      <h3 className="font-semibold text-slate-800 mb-2">Быстрая загрузка</h3>
                      <p className="text-sm text-slate-600">Оптимизированный движок для мгновенной загрузки страниц</p>
                    </Card>

                    <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-green-200 hover:border-green-400">
                      <Icon name="Shield" size={32} className="text-green-600 mx-auto mb-4" />
                      <h3 className="font-semibold text-slate-800 mb-2">Безопасность</h3>
                      <p className="text-sm text-slate-600">Встроенная защита от вредоносного ПО и трекеров</p>
                    </Card>

                    <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-purple-200 hover:border-purple-400">
                      <Icon name="Palette" size={32} className="text-purple-600 mx-auto mb-4" />
                      <h3 className="font-semibold text-slate-800 mb-2">Кастомизация</h3>
                      <p className="text-sm text-slate-600">Гибкие настройки интерфейса под ваши потребности</p>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <Input
                      placeholder="Введите URL для начала работы..."
                      className="max-w-md mx-auto"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const value = (e.target as HTMLInputElement).value;
                          if (value) {
                            navigateToUrl(value);
                          }
                        }
                      }}
                    />
                    <div className="flex justify-center space-x-4">
                      <Button onClick={() => navigateToUrl('https://google.com')}>
                        <Icon name="Search" size={16} className="mr-2" />
                        Google
                      </Button>
                      <Button variant="outline" onClick={() => navigateToUrl('https://github.com')}>
                        <Icon name="Github" size={16} className="mr-2" />
                        GitHub
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-slate-50">
                <div className="text-center">
                  <Icon name="Globe" size={48} className="text-slate-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-slate-600 mb-2">Загрузка страницы...</h2>
                  <p className="text-slate-500">{addressBarValue}</p>
                  <div className="mt-4">
                    <div className="w-64 bg-slate-200 rounded-full h-2 mx-auto">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel */}
        {activePanel !== 'none' && (
          <div className="w-80 bg-white border-l border-slate-200 shadow-lg">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">
                {activePanel === 'bookmarks' && 'Закладки'}
                {activePanel === 'downloads' && 'Загрузки'}
                {activePanel === 'settings' && 'Настройки'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActivePanel('none')}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
            
            <ScrollArea className="h-full">
              {activePanel === 'bookmarks' && (
                <div className="p-4 space-y-3">
                  {bookmarks.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="flex items-center p-3 rounded-lg hover:bg-slate-50 cursor-pointer group"
                      onClick={() => navigateToUrl(bookmark.url)}
                    >
                      <Icon name="Bookmark" size={16} className="text-blue-600 mr-3" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">{bookmark.title}</p>
                        <p className="text-xs text-slate-500 truncate">{bookmark.url}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                        <Icon name="ExternalLink" size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {activePanel === 'downloads' && (
                <div className="p-4 space-y-3">
                  {downloads.map((download) => (
                    <div key={download.id} className="p-3 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-slate-800 text-sm truncate">{download.filename}</p>
                        <Badge variant={download.status === 'completed' ? 'default' : 'secondary'}>
                          {download.status === 'completed' ? 'Завершено' : 'Загружается'}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{download.size}</p>
                      {download.status === 'downloading' && (
                        <div className="w-full bg-slate-200 rounded-full h-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full transition-all"
                            style={{width: `${download.progress}%`}}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activePanel === 'settings' && (
                <div className="p-4 space-y-4">
                  <div className="space-y-3">
                    <h3 className="font-medium text-slate-800">Внешний вид</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Темная тема</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">Показывать закладки</span>
                      </label>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-slate-800">Приватность</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">Блокировать трекеры</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Очищать куки при закрытии</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-slate-500">
          <span>Готов</span>
          {isIncognitoMode && (
            <Badge variant="outline" className="text-xs">
              <Icon name="EyeOff" size={12} className="mr-1" />
              Режим инкогнито
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-3 text-xs text-slate-500">
          <span>Масштаб: 100%</span>
          <span>•</span>
          <span>Защищено</span>
        </div>
      </div>
    </div>
  );
};

export default Index;