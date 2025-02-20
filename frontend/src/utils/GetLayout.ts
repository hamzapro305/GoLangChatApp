import { ReactNode } from "react";

type Props<T extends string> = Readonly<{
    [k in T]: ReactNode;
}>;

const GetLayout = <T extends string>(
    Layout: (props: Props<T>) => ReactNode
) => {
    return Layout;
};

export default GetLayout;
