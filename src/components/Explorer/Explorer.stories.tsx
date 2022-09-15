import React from 'react';
import type { Story, Meta } from '@storybook/react';
import {Toast} from '../prime';

import page from './README.mdx';
import Explorer from './index';
import {fetchItems, updateItems} from './mock';
import decorators from '../test/decorator';

const meta: Meta = {
    title: 'Explorer',
    component: Explorer,
    parameters: {docs: {page}},
    decorators,
    args: {
        state: {}
    }
};
export default meta;

const Template: Story<{
    createPermission?: string,
    editPermission?: string,
    deletePermission?: string,
    details?: object,
    children?: React.ReactNode,
    columns?: string[]
}> = ({
    createPermission,
    editPermission,
    deletePermission,
    details,
    children,
    columns = ['name', 'size'],
    ...props
}) => {
    const toast = React.useRef(null);
    const show = action => data => toast.current.show({
        severity: 'success',
        summary: 'Submit',
        detail: <pre>{JSON.stringify({action, data}, null, 2)}</pre>
    });
    return (
        <>
            <Toast ref={toast} />
            <div style={{height: 'fit-content', display: 'flex', flexDirection: 'column'}}>
                <Explorer
                    fetch={fetchItems}
                    keyField='id'
                    resultSet='items'
                    schema={{
                        properties: {
                            id: {
                                action: show('action')
                            },
                            name: {
                                action: show('action'),
                                title: 'Name',
                                filter: true,
                                sort: true
                            },
                            date: {
                                title: 'Date',
                                filter: true,
                                sort: true,
                                format: 'date'
                            },
                            time: {
                                title: 'Time',
                                filter: true,
                                sort: true,
                                format: 'time'
                            },
                            dateTime: {
                                title: 'Date and time',
                                filter: true,
                                sort: true,
                                format: 'date-time'
                            },
                            size: {
                                title: 'Size',
                                filter: true,
                                sort: true
                            }
                        }
                    }}
                    columns = {columns}
                    subscribe={updateItems}
                    details={details}
                    filter={{}}
                    toolbar={[{
                        title: 'Create',
                        permission: createPermission,
                        action: () => {}
                    }, {
                        title: 'Edit',
                        permission: editPermission,
                        enabled: 'current',
                        action: show('edit')
                    }, {
                        title: 'Delete',
                        permission: deletePermission,
                        enabled: 'selected',
                        action: show('delete')
                    }]}
                    {...props}
                >
                    {children}
                </Explorer>
            </div>
        </>
    );
};

export const Basic = Template.bind({});
Basic.args = {};

export const Design = Template.bind({});
Design.args = {
    ...Basic.args,
    design: true
};

export const Children = Template.bind({});
Children.args = {
    ...Basic.args,
    children: Array.from({length: 100}).fill(<div>Navigation component</div>)
};

export const Details = Template.bind({});
Details.args = {
    ...Children.args,
    details: {
        name: 'Name',
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis molestiae dicta nemo exercitationem! Suscipit sit ea quam labore vel, corporis quasi cum eos, animi distinctio quia id modi delectus saepe et cumque corrupti sint nobis, eveniet minima dolorem accusamus? Rem natus laborum cumque odit neque officia recusandae, molestias amet dolorum, iste ab laboriosam! Praesentium, totam quasi! Dolores soluta, reprehenderit incidunt est porro delectus corporis dolorem nam nisi hic tempore modi perspiciatis possimus cum doloribus dolorum nemo consequatur, ipsum ducimus ab sapiente, ad perferendis non debitis. Necessitatibus dolore dicta dolorum rem culpa debitis qui sapiente. Facere obcaecati cumque, sit ratione pariatur, perferendis odio, est placeat numquam autem ipsa quisquam natus vero corporis voluptate quaerat! Minima velit, culpa eum, enim accusamus commodi similique reiciendis aut accusantium nemo inventore sed aspernatur quidem voluptate earum ducimus explicabo ab ipsam officia sunt doloremque magnam? Deserunt mollitia voluptates itaque quam, eius sunt blanditiis? Deleniti consectetur est vel numquam voluptate molestias consequuntur dolore delectus tempora asperiores illo mollitia libero, veniam possimus incidunt maxime reiciendis tempore, voluptatem modi similique ab perferendis? Cum harum praesentium eligendi ex delectus velit, recusandae unde quo architecto quidem veritatis veniam perferendis quis nulla vel temporibus voluptates odit, dolore at, maiores accusantium nostrum! Alias repellendus in asperiores adipisci, deleniti nisi porro, cum quisquam ea corporis ullam obcaecati velit maiores odio officia quia quidem rem aspernatur ducimus aut aliquam temporibus! Minus ut excepturi magnam, sed omnis quod non reprehenderit enim rerum accusantium quas. Doloribus, laboriosam in amet iste quae delectus iusto doloremque tempora est quos rerum sint ex similique neque quaerat ullam temporibus sit aspernatur! Reprehenderit vitae natus deleniti, at totam eligendi sit saepe voluptas nemo voluptatem fugiat dicta ipsa magni. Iure ipsa similique, ex minus ab nemo magni, pariatur accusamus delectus inventore maxime, necessitatibus dolores animi error quidem aspernatur. Porro ducimus, nesciunt fugiat impedit molestias laudantium aliquam, numquam voluptates obcaecati quos expedita voluptas vitae necessitatibus, perferendis quo aperiam? Laboriosam distinctio voluptate quam ipsam corporis tempore harum nulla. Explicabo architecto possimus, officiis odio rem repudiandae nihil dolor, totam necessitatibus facilis voluptatibus sapiente molestiae in ex doloremque quae sed illo aliquid. Est ipsa quae, numquam, et id commodi porro in ex libero aut assumenda amet doloremque incidunt aliquid voluptate vel omnis voluptatibus non obcaecati aperiam. Vel autem natus enim vero incidunt a ipsam accusantium similique quae delectus quam rerum deserunt, eveniet quis, cum earum culpa explicabo velit excepturi quo assumenda consectetur minima. Eos minima repellendus est, fugit rem consequuntur incidunt repellat porro asperiores saepe iure. Asperiores vel harum nemo, quisquam ex sapiente labore iusto delectus quas! Veniam cupiditate quo molestias. Inventore cupiditate ad maiores tenetur ab quia nihil vero consequuntur aliquid. Rem recusandae, ipsum, porro non inventore ab molestiae dolorem nihil in praesentium nisi maxime voluptates? Amet sapiente ea beatae a quis est. Saepe ab inventore unde ullam dignissimos, voluptates sit et voluptas reiciendis nobis vero dolor neque fugit labore asperiores. Quisquam deserunt debitis officia itaque. Nisi error assumenda ullam inventore cupiditate. Facilis dolorem laboriosam iste iure ut illum ullam vero, sapiente laborum illo qui atque saepe, quam repellendus ipsum assumenda voluptates quae explicabo eos incidunt beatae minima quibusdam. Quae, veritatis. Itaque, dicta! Cumque doloribus itaque possimus, tenetur dignissimos voluptates quos sapiente, atque numquam totam animi esse repellat asperiores a harum veritatis consequatur omnis quis debitis, blanditiis at. Mollitia odio atque aliquid dolorum id magnam eos fugit reiciendis? Dolorum sequi incidunt facere vitae eius quas rerum explicabo nam voluptate deleniti vel nulla, alias vero dolores numquam corporis quae veritatis ullam tenetur commodi necessitatibus dicta maiores harum magnam. Aperiam repellendus exercitationem quidem mollitia id ipsum debitis expedita tenetur rerum veniam, veritatis esse illo temporibus porro, ipsam incidunt? Facilis saepe alias deserunt, exercitationem pariatur recusandae, adipisci, nam impedit eius voluptatum at laboriosam aut atque? Maxime, similique, sequi ullam quibusdam nisi temporibus quis voluptatibus explicabo quas adipisci unde facere ipsa architecto voluptas nostrum laborum recusandae natus minus placeat nulla sit eaque saepe! Vel accusamus possimus ratione quibusdam eveniet facilis, nostrum dolor tenetur repellat nemo id, ut quam optio! Soluta quas praesentium quae consectetur nostrum officiis iusto repellat fugiat, illo et magnam doloremque, autem reiciendis saepe facere ea velit maxime. Molestias velit cupiditate illo officiis accusamus a illum sunt, ab doloribus, in unde nulla, amet dolor natus nesciunt commodi quis dolore! Assumenda a commodi, reiciendis consequatur corrupti, reprehenderit inventore, mollitia quod nostrum expedita suscipit illo! Voluptatum, accusamus commodi nihil repellendus dolorem suscipit animi eos dolore consequuntur odit sit, blanditiis eum autem nam? Necessitatibus consequatur repellendus rerum voluptate hic ea natus aut, veniam, quibusdam alias quidem dolorum laborum doloremque iusto nemo! Atque, provident animi? Adipisci accusamus suscipit natus aperiam perferendis consectetur veritatis veniam commodi esse quos recusandae labore, iste nam quasi deleniti, modi sint a impedit in sed cum ad repudiandae laboriosam! Aliquam accusantium recusandae atque excepturi tempora veritatis eum nostrum. Unde a nam laboriosam cum eaque distinctio consequatur maxime fugiat voluptates, ea laborum veniam magnam? Unde ratione ab, tempora reiciendis fuga beatae cum provident voluptatem incidunt itaque, adipisci, ipsum commodi soluta in ut. Doloremque blanditiis dolorem tenetur fugiat quasi, consectetur excepturi pariatur nulla cum. Illo eligendi cupiditate sit tempore modi temporibus eaque quam impedit? Nostrum in maxime voluptatibus laboriosam, totam ex a modi ducimus quam. Aspernatur incidunt eius quaerat placeat debitis modi nostrum! Hic exercitationem, autem corrupti harum architecto rerum perferendis ducimus tempore vitae accusamus in doloremque quia ipsam sed nisi optio dolorum iure similique illum atque facere eaque placeat at. Laudantium optio quia molestiae sunt atque et harum dolor, nesciunt delectus, quas amet, quam deleniti facilis aperiam. Nisi dolorem eum distinctio dolores debitis non harum at, repellat repellendus totam deserunt reprehenderit id voluptate facere deleniti temporibus sint obcaecati provident voluptates enim voluptas perferendis soluta magnam possimus! Soluta dolorem commodi necessitatibus, recusandae, maiores, natus ipsa amet ad incidunt illum sit odio excepturi animi tempora doloremque! Libero qui dolore quos possimus expedita vitae esse assumenda necessitatibus corrupti! Tempora, quasi voluptatem animi, maiores eos sunt reiciendis magni eaque tenetur culpa ex porro repudiandae amet dolores quos reprehenderit, quas minus? Nostrum corporis mollitia qui atque dolorem ex, assumenda itaque velit, quidem ea voluptas."
    }
};

export const ActionPermissions = Template.bind({});
ActionPermissions.args = {
    ...Details.args,
    createPermission: 'forbidden',
    editPermission: 'granted',
    deletePermission: 'forbidden'
};

export const DateTimeFilter = Template.bind({});
DateTimeFilter.args = {
    ...Basic.args,
    columns: ['date', 'time', 'dateTime']
};

export const Grid = Template.bind({});
Grid.args = {
    ...Basic.args,
    cards: {
        grid: {
            type: 'grid',
            widgets: [{
                name: 'name', type: 'label'
            }, {
                name: 'size', type: 'label'
            }]
        }
    },
    pageSize: 36,
    layout: ['grid']
};

export const GridFlex = Template.bind({});
GridFlex.args = {
    ...Basic.args,
    cards: {
        grid: {
            type: 'grid',
            className: 'col-6 md:col-3',
            classes: {
                default: {
                    root: 'grid m-0',
                    widget: 'text-center col-4 mb-0'
                }
            },
            widgets: [{
                type: 'icon', title: 'pi-paperclip'
            }, {
                name: 'name', type: 'label'
            }, {
                name: 'size', type: 'label'
            }]
        }
    },
    pageSize: 24,
    layout: ['grid']
};
