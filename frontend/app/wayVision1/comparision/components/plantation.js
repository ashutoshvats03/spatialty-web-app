import React, { PureComponent } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';




export default class Example extends PureComponent {

    static demoUrl = 'https://codesandbox.io/p/sandbox/scatter-chart-with-double-yaxes-3yzqtm';

    constructor(props) {
        super(props);
    }


    render() {
        const { array3 } = this.props;
        const newData = array3.map(([chainage, plantation]) => ({
            chainage,
            plantation: parseInt(plantation), // Convert string to number
        }));
        console.log("newData", newData);
        return (
            <div className='p-10 mx-16 bg-slate-800  border-4  rounded-sm'><ResponsiveContainer width="100%" height={400}>
                <ScatterChart
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 40,
                        left: 20,
                    }}
                >
                    <CartesianGrid />
                    <XAxis
                        dataKey="chainage"
                        name="chainage"
                        tick={{
                            angle: -55,
                            textAnchor: "end",
                        }}
                        stroke='white'
                    />
                    <YAxis
                        dataKey="plantation"
                        name="plantation"
                        stroke='white' />

                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter
                        name="A school"
                        data={array3.map(
                            ([chainage, plantation]) => ({
                                chainage,
                                plantation: parseInt(plantation), // Convert string to number
                            })
                        )}
                        fill="red" />
                </ScatterChart>
            </ResponsiveContainer>
            </div>
        );
    }
}
