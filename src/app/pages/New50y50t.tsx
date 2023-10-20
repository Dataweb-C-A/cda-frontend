import React, { useEffect, useState } from 'react';
import { links } from '../assets/data/links'
import Navbar from '../components/navbar'
import axios from 'axios'
import {
    Card,
    Table,
    Title,
    Pagination,
    Group,
    Divider,

} from '@mantine/core';
import Newtaquilla from '../components/navbar/Newtaquilla';

type Props = {}


const New50y50t = (props: Props) => {
    const [users, setUsers] = useState<any>([])

    const elements = [
        { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
        { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
    ];
    const rows = elements.map((element) => (
        <tr key={element.name}>
            <td>{element.position}</td>
            <td>{element.name}</td>
            <td>{element.symbol}</td>
            <td>{element.mass}</td>
        </tr>
    ));
    type Props = {}

    return (
        <>
            <Navbar
                profiles={users}
                links={links}
                expandScreen={true}
            />

            <Card
                mt={15}
                ml={15}
                mr={15}
                h={780}
            >
                <Group position='apart'>

                    <Title order={3}>
                        Taquilla 50 y 50
                    </Title>

                    <Newtaquilla />

                </Group>

                <Divider my="sm" variant="dashed" />

                 <Pagination mt={15} total={10} />

                <Table mt={20} striped highlightOnHover withBorder withColumnBorders>
                    <thead>
                        <tr>
                            <th>Element position</th>
                            <th>Element name</th>
                            <th>Symbol</th>
                            <th>Atomic mass</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </Card>
        </>
    )
}

export default New50y50t