/* istanbul ignore file */
import type { TabsProps } from './tabs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
};

export default meta;

export const Playground = (args: TabsProps) => (
  <Tabs {...args}>
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="usage">Usage</TabsTrigger>
      <TabsTrigger value="history">History</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">
      <div className="flex flex-col gap-2">
        <h4 className="text-base font-semibold text-foreground">Overview</h4>
        <p className="text-muted">High level summary content lives here.</p>
      </div>
    </TabsContent>
    <TabsContent value="usage">
      <div className="flex flex-col gap-2">
        <h4 className="text-base font-semibold text-foreground">Usage</h4>
        <p className="text-muted">
          Best practices, copy, and quick references.
        </p>
      </div>
    </TabsContent>
    <TabsContent value="history">
      <div className="flex flex-col gap-2">
        <h4 className="text-base font-semibold text-foreground">History</h4>
        <p className="text-muted">Changes or notes for this section.</p>
      </div>
    </TabsContent>
  </Tabs>
);

Playground.args = {
  defaultValue: 'overview',
};
