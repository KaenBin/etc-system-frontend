import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Disclosure, DisclosureButton } from "@headlessui/react";
import { Card } from "@nextui-org/card";
import { Button } from "@nextui-org/button";

import { siteConfig } from "@/config/site";

export const Sidebar = () => {
  return (
    <Card className="h-full w-64 bg-primary rounded-none flex-none flex-col">
      <Disclosure as="nav" className="flex-grow">
        <DisclosureButton className="absolute right-4 inline-flex items-center peer justify-center rounded-md p-2 text-gray-800 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white group">
          <GiHamburgerMenu
            aria-hidden="true"
            className="block md:hidden h-6 w-6"
          />
        </DisclosureButton>
        <div className="p-6 w-64 h-full bg-primary z-20 fixed -left-96 lg:left-0 lg:w-60 peer-focus:left-0 peer:transition ease-out delay-150 duration-200">
          <div className="flex flex-col justify-start item-center">
            <div className="my-4 border-b border-secondary pb-4">
              {siteConfig.navItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Button
                    key={index}
                    as="a"
                    className="flex w-full mb-4 justify-start items-center gap-6 pl-5 p-2 rounded-md bg-transparent hover:bg-primary-foreground data-[active=true]:bg-primary bg-primary text-secondary"
                    href={item.href}
                    startContent={
                      <Icon className="text-2xl text-secondary group-hover:text-white" />
                    }
                  >
                    <h3 className="text-secondary text-gray-800 group-hover:text-white font-semibold ">
                      {item.label}
                    </h3>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </Disclosure>
    </Card>
  );
};
