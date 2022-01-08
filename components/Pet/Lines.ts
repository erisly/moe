interface Line {
    line: string;
    requirements: {
        employees?: number;
    };
}

const lines: Line[] = [
    {
        line: `BREAKING NEWS: A local man has begun to hire various people to pet a woman on her head. Employees say that they are not being paid in "material things" like money, they are being paid with the privilege to pet the mysterious woman.`,
        requirements: {
            employees: 5,
        },
    },
];

export default lines;
